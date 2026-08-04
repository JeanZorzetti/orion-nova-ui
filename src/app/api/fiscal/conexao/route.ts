import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, mascarar } from "@/lib/crypto";
import { validarToken } from "@/lib/focus-nfe";
import { isMember } from "@/lib/account";
import { z } from "zod";

/**
 * Conexão da conta do cliente com a Focus NFe (modelo BYO). O token nunca sai
 * daqui em claro: entra no PUT, é validado, e volta mascarado no GET.
 */

const conexaoSchema = z.object({
  token: z.string().trim().min(10, "Token muito curto"),
  ambiente: z.enum(["HOMOLOGACAO", "PRODUCAO"]).default("HOMOLOGACAO"),
});

async function empresaDaConta(accountId: string) {
  return prisma.company.findUnique({
    where: { userId: accountId },
    select: { focusNfeToken: true, focusNfeCnpj: true, focusNfeConectadoEm: true, ambienteNfe: true },
  });
}

// GET /api/fiscal/conexao - status da conexão, sem revelar o token
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const company = await empresaDaConta(session.user.accountId);

  return NextResponse.json({
    conectado: Boolean(company?.focusNfeToken),
    ambiente: company?.ambienteNfe ?? "HOMOLOGACAO",
    cnpj: company?.focusNfeCnpj ?? null,
    conectadoEm: company?.focusNfeConectadoEm ?? null,
    // Máscara sobre o cifrado só para o usuário reconhecer que há algo salvo.
    token: company?.focusNfeToken ? mascarar(company.focusNfeToken) : null,
  });
}

// PUT /api/fiscal/conexao - valida o token na Focus e guarda cifrado
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Conectar emissão fiscal é decisão do dono da conta, não de um membro.
    if (isMember(session)) {
      return NextResponse.json(
        { error: "Só o dono da conta pode conectar a emissão fiscal." },
        { status: 403 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { userId: session.user.accountId },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Cadastre os dados da empresa antes de conectar a emissão fiscal." },
        { status: 409 }
      );
    }

    const { token, ambiente } = conexaoSchema.parse(await request.json());

    const resultado = await validarToken(token, ambiente);
    if (!resultado.ok) {
      // 502 quando o problema é a Focus, 400 quando é o token do usuário.
      const status = resultado.motivo === "indisponivel" ? 502 : 400;
      return NextResponse.json({ error: resultado.mensagem }, { status });
    }

    await prisma.company.update({
      where: { userId: session.user.accountId },
      data: {
        focusNfeToken: encrypt(token),
        ambienteNfe: ambiente,
        focusNfeConectadoEm: new Date(),
      },
    });

    return NextResponse.json({ conectado: true, ambiente });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao conectar emissão fiscal:", error);
    return NextResponse.json({ error: "Erro ao conectar" }, { status: 500 });
  }
}

// DELETE /api/fiscal/conexao - desconecta
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (session.user.id !== session.user.accountId) {
    return NextResponse.json(
      { error: "Só o dono da conta pode desconectar a emissão fiscal." },
      { status: 403 }
    );
  }

  await prisma.company.update({
    where: { userId: session.user.accountId },
    data: { focusNfeToken: null, focusNfeCnpj: null, focusNfeConectadoEm: null },
  });

  return NextResponse.json({ conectado: false });
}
