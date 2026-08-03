import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const optionalText = z.string().trim().max(255).optional().or(z.literal(""));

const companySchema = z.object({
  companyName: z.string().trim().min(1, "Razão social é obrigatória").max(255),
  tradeName: optionalText,
  // Aceita com ou sem máscara; normalizado para 14 dígitos abaixo.
  cnpj: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v === "" || v.length === 14, "CNPJ deve ter 14 dígitos")
    .optional(),
  phone: optionalText,
  email: z.string().trim().email("Email inválido").optional().or(z.literal("")),
  website: z.string().trim().url("URL inválida").optional().or(z.literal("")),
  address: optionalText,
  city: optionalText,
  state: z.string().trim().length(2, "UF deve ter 2 letras").optional().or(z.literal("")),
  zipCode: optionalText,
});

// Campos vazios do form viram null no banco, não string vazia.
const nullify = <T extends Record<string, unknown>>(data: T) =>
  Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, v === "" ? null : v])
  ) as { [K in keyof T]: T[K] | null };

// GET /api/company - Dados da empresa do usuário logado
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const company = await prisma.company.findUnique({
      where: { userId: session.user.accountId },
    });

    return NextResponse.json({ company });
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados da empresa" },
      { status: 500 }
    );
  }
}

// PUT /api/company - Criar ou atualizar os dados da empresa
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const parsed = nullify(companySchema.parse(await request.json()));
    const { companyName, ...rest } = parsed;

    const company = await prisma.company.upsert({
      where: { userId: session.user.accountId },
      create: { userId: session.user.accountId, companyName: companyName!, ...rest },
      update: { companyName: companyName!, ...rest },
    });

    return NextResponse.json({ company });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao salvar empresa:", error);
    return NextResponse.json(
      { error: "Erro ao salvar dados da empresa" },
      { status: 500 }
    );
  }
}
