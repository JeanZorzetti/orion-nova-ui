import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { limiteEstourado } from "@/lib/account";

// Schema de validação para criação de cliente
const createCustomerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional().nullable(),
  phone: z.string().optional().nullable(),
  cpfCnpj: z.string().optional().nullable(),
  type: z.enum(["PESSOA_FISICA", "PESSOA_JURIDICA"]).default("PESSOA_FISICA"),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

// GET /api/customers - Listar clientes
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive");

    // Construir filtros
    const where: any = {
      userId: session.user.accountId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { cpfCnpj: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    // Buscar clientes com paginação
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao listar clientes" },
      { status: 500 }
    );
  }
}

// POST /api/customers - Criar cliente
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createCustomerSchema.parse(body);

    const limite = await limiteEstourado(session.user.accountId, "customers");
    if (limite) {
      return NextResponse.json({ error: limite, code: "PLAN_LIMIT" }, { status: 402 });
    }

    // Verificar se já existe cliente com mesmo email ou CPF/CNPJ
    if (validatedData.email) {
      const existingEmail = await prisma.customer.findUnique({
        where: { email: validatedData.email },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email já cadastrado" },
          { status: 400 }
        );
      }
    }

    if (validatedData.cpfCnpj) {
      const existingCpfCnpj = await prisma.customer.findUnique({
        where: { cpfCnpj: validatedData.cpfCnpj },
      });
      if (existingCpfCnpj) {
        return NextResponse.json(
          { error: "CPF/CNPJ já cadastrado" },
          { status: 400 }
        );
      }
    }

    const customer = await prisma.customer.create({
      data: {
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        cpfCnpj: validatedData.cpfCnpj || null,
        type: validatedData.type,
        address: validatedData.address || null,
        city: validatedData.city || null,
        state: validatedData.state || null,
        zipCode: validatedData.zipCode || null,
        notes: validatedData.notes || null,
        isActive: validatedData.isActive,
        userId: session.user.accountId,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao criar cliente" },
      { status: 500 }
    );
  }
}
