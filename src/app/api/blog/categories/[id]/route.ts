import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH /api/blog/categories/[id] - Atualizar categoria
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, description } = body;

    // Verificar se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se o slug já está em uso por outra categoria
    if (slug && slug !== existingCategory.slug) {
      const categoryWithSlug = await prisma.category.findUnique({
        where: { slug },
      });
      if (categoryWithSlug) {
        return NextResponse.json(
          { error: "Slug já está em uso" },
          { status: 400 }
        );
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/categories/[id] - Deletar categoria
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await params;

    // Verificar se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Não permitir deletar categoria com posts
    if (existingCategory._count.posts > 0) {
      return NextResponse.json(
        {
          error: `Não é possível deletar categoria com ${existingCategory._count.posts} post(s)`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao deletar categoria" },
      { status: 500 }
    );
  }
}
