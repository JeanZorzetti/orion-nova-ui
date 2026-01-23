import { NextRequest, NextResponse } from "next/server";
import { checkAndCreateTrialNotifications } from "@/lib/notifications";

// GET /api/cron/trial-notifications - Verificar trials e criar notificações
// Este endpoint deve ser chamado por um cron job (diariamente)
// Exemplo: Vercel Cron, GitHub Actions, ou serviço externo de cron
export async function GET(req: NextRequest) {
  try {
    // Verificar se tem authorization header (segurança básica para cron)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "your-secret-key-here";

    // Se CRON_SECRET estiver configurado, validar
    if (cronSecret !== "your-secret-key-here") {
      if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: "Não autorizado - token inválido" },
          { status: 401 }
        );
      }
    }

    // Executar verificação de trials
    const results = await checkAndCreateTrialNotifications();

    return NextResponse.json({
      success: true,
      message: "Verificação de trials concluída",
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Erro no cron de trial notifications:", error);
    return NextResponse.json(
      {
        error: error.message || "Erro ao executar verificação de trials",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
