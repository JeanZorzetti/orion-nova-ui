import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Por segurança, sempre retornar sucesso mesmo se o usuário não existir
    // Isso previne enumeration attacks
    if (!user) {
      return NextResponse.json({
        message: "Se o email existir, um link de recuperação será enviado.",
      });
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco (você precisará adicionar esses campos ao schema)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // O e-mail era um TODO: a rota gravava o token, imprimia no console e
    // respondia "link enviado". Ninguém nunca recebeu link nenhum — e
    // sendPasswordResetEmail já existia em lib/email.ts, sem ser chamada.
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name ?? "",
      resetToken,
    });

    return NextResponse.json({
      message: "Se o email existir, um link de recuperação será enviado.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
