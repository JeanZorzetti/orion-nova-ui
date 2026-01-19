import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH /api/plans/[id] - Atualizar plano
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Apenas ADMIN e SUPER_ADMIN podem atualizar planos
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      billingPeriod,
      maxUsers,
      maxStorage,
      isActive,
      features,
    } = body;

    // Validar se o plano existe
    const existingPlan = await prisma.plan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o slug já está em uso por outro plano
    if (slug && slug !== existingPlan.slug) {
      const planWithSlug = await prisma.plan.findUnique({
        where: { slug },
      });
      if (planWithSlug) {
        return NextResponse.json(
          { error: "Slug já está em uso" },
          { status: 400 }
        );
      }
    }

    // Atualizar plano
    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(billingPeriod && { billingPeriod }),
        ...(maxUsers !== undefined && { maxUsers }),
        ...(maxStorage !== undefined && { maxStorage }),
        ...(isActive !== undefined && { isActive }),
        ...(features && { features }),
      },
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("Erro ao atualizar plano:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar plano" },
      { status: 500 }
    );
  }
}

// DELETE /api/plans/[id] - Deletar plano
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Apenas SUPER_ADMIN pode deletar planos
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await params;

    // Validar se o plano existe
    const existingPlan = await prisma.plan.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 }
      );
    }

    // Não permitir deletar plano com assinaturas ativas
    if (existingPlan._count.subscriptions > 0) {
      return NextResponse.json(
        {
          error: `Não é possível deletar plano com ${existingPlan._count.subscriptions} assinatura(s) ativa(s)`,
        },
        { status: 400 }
      );
    }

    // Deletar plano
    await prisma.plan.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Plano deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar plano:", error);
    return NextResponse.json(
      { error: "Erro ao deletar plano" },
      { status: 500 }
    );
  }
}
