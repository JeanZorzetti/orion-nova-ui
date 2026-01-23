import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/onboarding - Buscar progresso do onboarding
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar ou criar registro de onboarding
    let onboarding = await prisma.userOnboarding.findUnique({
      where: { userId: session.user.id },
    });

    // Se não existir, criar um novo
    if (!onboarding) {
      onboarding = await prisma.userOnboarding.create({
        data: {
          userId: session.user.id,
          currentStep: "welcome",
          completedSteps: [],
        },
      });
    }

    return NextResponse.json({
      currentStep: onboarding.currentStep,
      completedSteps: Array.isArray(onboarding.completedSteps)
        ? onboarding.completedSteps
        : [],
      isCompleted: onboarding.isCompleted,
      skipTour: onboarding.skipTour,
      skipMigration: onboarding.skipMigration,
    });
  } catch (error: any) {
    console.error("Erro ao buscar onboarding:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar onboarding" },
      { status: 500 }
    );
  }
}

// POST /api/user/onboarding - Atualizar progresso do onboarding
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { stepId, action } = body;

    if (!stepId || !action) {
      return NextResponse.json(
        { error: "stepId e action são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar ou criar registro de onboarding
    let onboarding = await prisma.userOnboarding.findUnique({
      where: { userId: session.user.id },
    });

    if (!onboarding) {
      onboarding = await prisma.userOnboarding.create({
        data: {
          userId: session.user.id,
          currentStep: "welcome",
          completedSteps: [],
        },
      });
    }

    const completedSteps = Array.isArray(onboarding.completedSteps)
      ? onboarding.completedSteps
      : [];

    // Ações disponíveis: complete, skip, reset
    if (action === "complete") {
      // Adicionar step aos completados se ainda não estiver
      if (!completedSteps.includes(stepId)) {
        completedSteps.push(stepId);
      }

      // Determinar próximo step
      const steps = [
        "welcome",
        "company_setup",
        "fiscal_setup",
        "first_product",
        "first_customer",
        "first_sale",
        "migration",
        "integrations",
      ];

      const currentIndex = steps.indexOf(stepId);
      const nextStep = steps[currentIndex + 1] || null;

      // Verificar se todos os steps obrigatórios foram completados
      const requiredSteps = [
        "welcome",
        "company_setup",
        "fiscal_setup",
        "first_product",
        "first_customer",
        "first_sale",
      ];
      const allRequiredCompleted = requiredSteps.every((s) =>
        completedSteps.includes(s)
      );

      // Atualizar onboarding
      onboarding = await prisma.userOnboarding.update({
        where: { userId: session.user.id },
        data: {
          completedSteps,
          currentStep: nextStep,
          isCompleted: allRequiredCompleted,
          completedAt: allRequiredCompleted ? new Date() : null,
        },
      });
    } else if (action === "skip") {
      // Marcar como skipado (apenas para steps opcionais)
      const optionalSteps = ["migration", "integrations"];
      if (optionalSteps.includes(stepId)) {
        if (stepId === "migration") {
          onboarding = await prisma.userOnboarding.update({
            where: { userId: session.user.id },
            data: { skipMigration: true },
          });
        }
      }
    } else if (action === "reset") {
      // Resetar onboarding
      onboarding = await prisma.userOnboarding.update({
        where: { userId: session.user.id },
        data: {
          completedSteps: [],
          currentStep: "welcome",
          isCompleted: false,
          completedAt: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      currentStep: onboarding.currentStep,
      completedSteps: Array.isArray(onboarding.completedSteps)
        ? onboarding.completedSteps
        : [],
      isCompleted: onboarding.isCompleted,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar onboarding:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar onboarding" },
      { status: 500 }
    );
  }
}
