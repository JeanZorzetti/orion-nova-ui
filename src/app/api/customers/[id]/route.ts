import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para atualização de cliente
const updateCustomerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("Email inválido").optional().nullable(),
  phone: z.string().optional().nullable(),
  cpfCnpj: z.string().optional().nullable(),
  type: z.enum(["PESSOA_FISICA", "PESSOA_JURIDICA"]).optional(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// GET /api/customers/[id] - Buscar cliente
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        userId: session.user.accountId,
      },
      include: {
        salesOrders: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cliente" },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Atualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateCustomerSchema.parse(body);

    // Verificar se o cliente existe e pertence ao usuário
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id,
        userId: session.user.accountId,
      },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Verificar duplicação de email (se estiver alterando)
    if (validatedData.email && validatedData.email !== existingCustomer.email) {
      const duplicateEmail = await prisma.customer.findUnique({
        where: { email: validatedData.email },
      });
      if (duplicateEmail) {
        return NextResponse.json(
          { error: "Email já cadastrado" },
          { status: 400 }
        );
      }
    }

    // Verificar duplicação de CPF/CNPJ (se estiver alterando)
    if (
      validatedData.cpfCnpj &&
      validatedData.cpfCnpj !== existingCustomer.cpfCnpj
    ) {
      const duplicateCpfCnpj = await prisma.customer.findUnique({
        where: { cpfCnpj: validatedData.cpfCnpj },
      });
      if (duplicateCpfCnpj) {
        return NextResponse.json(
          { error: "CPF/CNPJ já cadastrado" },
          { status: 400 }
        );
      }
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Deletar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar se o cliente existe e pertence ao usuário
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id,
        userId: session.user.accountId,
      },
      include: {
        salesOrders: true,
      },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o cliente tem pedidos
    if (existingCustomer.salesOrders.length > 0) {
      return NextResponse.json(
        {
          error:
            "Não é possível excluir um cliente com pedidos. Desative-o em vez disso.",
        },
        { status: 400 }
      );
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Cliente excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao deletar cliente" },
      { status: 500 }
    );
  }
}
