import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para atualização de produto
const updateProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  sku: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  type: z.enum(["PRODUCT", "SERVICE"]).optional(),
  category: z.string().optional().nullable(),
  price: z.number().min(0, "Preço deve ser maior ou igual a zero").optional(),
  cost: z.number().min(0, "Custo deve ser maior ou igual a zero").optional().nullable(),
  stockQuantity: z.number().int().min(0, "Quantidade deve ser maior ou igual a zero").optional(),
  minStock: z.number().int().min(0, "Estoque mínimo deve ser maior ou igual a zero").optional(),
  unit: z.string().optional(),
  isActive: z.boolean().optional(),
  image: z.string().optional().nullable(),
});

// GET /api/products/[id] - Buscar produto
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

    const product = await prisma.product.findFirst({
      where: {
        id,
        userId: session.user.accountId,
      },
      include: {
        orderItems: {
          include: {
            order: {
              include: {
                customer: true,
              },
            },
          },
          orderBy: { order: { createdAt: "desc" } },
          take: 10,
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Atualizar produto
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
    const validatedData = updateProductSchema.parse(body);

    // Verificar se o produto existe e pertence ao usuário
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        userId: session.user.accountId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Verificar duplicação de SKU (se estiver alterando)
    if (validatedData.sku && validatedData.sku !== existingProduct.sku) {
      const duplicateSku = await prisma.product.findUnique({
        where: { sku: validatedData.sku },
      });
      if (duplicateSku) {
        return NextResponse.json(
          { error: "SKU já cadastrado" },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Deletar produto
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

    // Verificar se o produto existe e pertence ao usuário
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        userId: session.user.accountId,
      },
      include: {
        orderItems: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o produto tem pedidos
    if (existingProduct.orderItems.length > 0) {
      return NextResponse.json(
        {
          error:
            "Não é possível excluir um produto com pedidos. Desative-o em vez disso.",
        },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return NextResponse.json(
      { error: "Erro ao deletar produto" },
      { status: 500 }
    );
  }
}
