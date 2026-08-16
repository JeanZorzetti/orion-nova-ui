import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createOnboardingStepCompletedNotification,
  createOnboardingCompletedNotification,
} from "@/lib/notifications";
import { G5_REPORT_STEP } from "@/lib/g5";

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

    const completedSteps = Array.isArray(onboarding.completedSteps)
      ? onboarding.completedSteps
      : [];

    // Marcos do G5. Derivados do banco em vez de flags para não dessincronizar:
    // findFirst com select do id é uma linha lida, não um count da tabela.
    const accountId = session.user.accountId;
    const [cliente, produto, pedido] = await Promise.all([
      prisma.customer.findFirst({ where: { userId: accountId }, select: { id: true } }),
      prisma.product.findFirst({ where: { userId: accountId }, select: { id: true } }),
      prisma.salesOrder.findFirst({ where: { userId: accountId }, select: { id: true } }),
    ]);

    return NextResponse.json({
      currentStep: onboarding.currentStep,
      completedSteps,
      isCompleted: onboarding.isCompleted,
      skipTour: onboarding.skipTour,
      skipMigration: onboarding.skipMigration,
      g5: {
        customer: !!cliente,
        product: !!produto,
        sale: !!pedido,
        report: completedSteps.includes(G5_REPORT_STEP),
      },
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
      const wasNewlyCompleted = !completedSteps.includes(stepId);
      if (wasNewlyCompleted) {
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

      const stepNames: Record<string, string> = {
        welcome: "Boas-vindas",
        company_setup: "Configuração da Empresa",
        fiscal_setup: "Configuração Fiscal",
        first_product: "Primeiro Produto",
        first_customer: "Primeiro Cliente",
        first_sale: "Primeira Venda",
        migration: "Migração de Dados",
        integrations: "Integrações",
        [G5_REPORT_STEP]: "Primeiro Relatório",
      };

      // Step fora da trilha ordenada (first_report) não mexe no ponteiro. Antes
      // disto, indexOf devolvia -1 e o currentStep voltava para "welcome" —
      // qualquer stepId desconhecido rebobinava o onboarding do usuário.
      const currentIndex = steps.indexOf(stepId);
      const nextStep =
        currentIndex === -1
          ? onboarding.currentStep
          : steps[currentIndex + 1] || null;

      // Verificar se todos os steps obrigatórios foram completados
      const requiredSteps = [
        "welcome",
        "company_setup",
        "fiscal_setup",
        "first_product",
        "first_customer",
        "first_sale",
      ];
      const wasAlreadyCompleted = onboarding.isCompleted;
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

      // Criar notificação para step completado (apenas se foi recém-completado)
      if (wasNewlyCompleted) {
        try {
          await createOnboardingStepCompletedNotification(
            session.user.id,
            stepId,
            stepNames[stepId] || stepId
          );
        } catch (notifError) {
          console.error(
            "Erro ao criar notificação de step completado:",
            notifError
          );
          // Não bloqueia o fluxo
        }
      }

      // Criar notificação de onboarding completo (apenas na primeira vez)
      if (allRequiredCompleted && !wasAlreadyCompleted) {
        try {
          await createOnboardingCompletedNotification(session.user.id);
        } catch (notifError) {
          console.error(
            "Erro ao criar notificação de onboarding completo:",
            notifError
          );
          // Não bloqueia o fluxo
        }
      }
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
