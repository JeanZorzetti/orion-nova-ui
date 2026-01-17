import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para criação de produto
const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  sku: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  type: z.enum(["PRODUCT", "SERVICE"]).default("PRODUCT"),
  category: z.string().optional().nullable(),
  price: z.number().min(0, "Preço deve ser maior ou igual a zero"),
  cost: z.number().min(0, "Custo deve ser maior ou igual a zero").optional().nullable(),
  stockQuantity: z.number().int().min(0, "Quantidade deve ser maior ou igual a zero").default(0),
  minStock: z.number().int().min(0, "Estoque mínimo deve ser maior ou igual a zero").default(0),
  unit: z.string().default("UN"),
  isActive: z.boolean().default(true),
  image: z.string().optional().nullable(),
});

// GET /api/products - Listar produtos
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
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");
    const lowStock = searchParams.get("lowStock");

    // Construir filtros
    const where: any = {
      userId: session.user.id,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (lowStock === "true") {
      where.AND = [
        { stockQuantity: { lte: prisma.product.fields.minStock } },
      ];
    }

    // Buscar produtos com paginação
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao listar produtos" },
      { status: 500 }
    );
  }
}

// POST /api/products - Criar produto
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Verificar se já existe produto com mesmo SKU
    if (validatedData.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: validatedData.sku },
      });
      if (existingSku) {
        return NextResponse.json(
          { error: "SKU já cadastrado" },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        sku: validatedData.sku || null,
        description: validatedData.description || null,
        type: validatedData.type,
        category: validatedData.category || null,
        price: validatedData.price,
        cost: validatedData.cost || null,
        stockQuantity: validatedData.stockQuantity,
        minStock: validatedData.minStock,
        unit: validatedData.unit,
        isActive: validatedData.isActive,
        image: validatedData.image || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}
