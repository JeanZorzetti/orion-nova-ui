import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isMember, seatLimit, seatsUsed } from "@/lib/account";
import { sendPasswordResetEmail } from "@/lib/email";

/**
 * Equipe da conta. O membro é criado já ligado ao dono (ownerId) e recebe um
 * link de definição de senha — o mesmo fluxo de /esqueci-senha, em vez de uma
 * tela de convite com token próprio.
 *
 * O membro enxerga os mesmos dados do dono porque as rotas do ERP filtram por
 * `session.user.accountId`, que para ele é o id do dono.
 */

// GET /api/team - dono e membros da conta, com o limite do plano
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const [dono, membros, limite] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.accountId },
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.user.findMany({
      where: { ownerId: session.user.accountId },
      select: { id: true, name: true, email: true, createdAt: true, password: true },
      orderBy: { createdAt: "asc" },
    }),
    seatLimit(session.user.accountId),
  ]);

  return NextResponse.json({
    owner: dono,
    // `pendente` = ainda não definiu a senha pelo link que recebeu.
    members: membros.map(({ password, ...m }) => ({ ...m, pendente: password === null })),
    seats: { used: 1 + membros.length, limit: limite },
    isOwner: !isMember(session),
  });
}

// POST /api/team - adiciona um membro à conta
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  if (isMember(session)) {
    return NextResponse.json(
      { error: "Só o dono da conta pode adicionar pessoas." },
      { status: 403 }
    );
  }

  const { name, email } = await request.json();
  const emailNormalizado = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!name?.trim() || !emailNormalizado) {
    return NextResponse.json({ error: "Nome e e-mail são obrigatórios." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  // Limite de assentos do plano. Esta é a primeira checagem de plano que existe
  // no sistema — até aqui os planos não limitavam nada.
  const [limite, usados] = await Promise.all([
    seatLimit(session.user.accountId),
    seatsUsed(session.user.accountId),
  ]);

  if (limite !== -1 && usados >= limite) {
    return NextResponse.json(
      {
        error: `Seu plano permite ${limite} ${limite === 1 ? "usuário" : "usuários"}, e você já usa ${usados}.`,
        code: "SEAT_LIMIT",
      },
      { status: 402 }
    );
  }

  const jaExiste = await prisma.user.findUnique({ where: { email: emailNormalizado } });

  if (jaExiste) {
    return NextResponse.json(
      { error: "Já existe uma conta com esse e-mail." },
      { status: 409 }
    );
  }

  // Sem senha: o membro define a dele pelo link. `password: null` também é o que
  // marca o convite como pendente na listagem.
  const resetToken = crypto.randomBytes(32).toString("hex");

  const membro = await prisma.user.create({
    data: {
      name: name.trim(),
      email: emailNormalizado,
      ownerId: session.user.accountId,
      role: "USER",
      // Trial e assinatura são do dono. Deixar TRIAL com trialEndsAt aqui faria
      // o cron mandar "seu trial expira" para quem não tem trial.
      trialEndsAt: null,
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  await sendPasswordResetEmail({
    to: membro.email,
    name: membro.name ?? "",
    resetToken,
  });

  return NextResponse.json({ member: { ...membro, pendente: true } }, { status: 201 });
}

// DELETE /api/team?id=... - remove um membro
export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  if (isMember(session)) {
    return NextResponse.json(
      { error: "Só o dono da conta pode remover pessoas." },
      { status: 403 }
    );
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID do membro é obrigatório." }, { status: 400 });
  }

  // O where com ownerId é o que impede remover usuário de outra conta.
  const { count } = await prisma.user.deleteMany({
    where: { id, ownerId: session.user.accountId },
  });

  if (count === 0) {
    return NextResponse.json({ error: "Membro não encontrado." }, { status: 404 });
  }

  // O JWT do removido continua válido até expirar; quem tira o acesso de fato é
  // a checagem no dashboard/layout.tsx, que não encontra mais o usuário.
  return NextResponse.json({ removed: id });
}
