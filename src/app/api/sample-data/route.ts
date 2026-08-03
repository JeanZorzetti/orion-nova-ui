import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { populateSampleData, clearSampleData, hasSampleData } from "@/lib/sample-data";

export async function POST(request: NextRequest) {
  try {
    // Verificar variáveis de ambiente críticas
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL não configurada");
      return NextResponse.json(
        { error: "Configuração do servidor incompleta: DATABASE_URL" },
        { status: 500 }
      );
    }

    let session;
    try {
      session = await auth();
    } catch (authError: any) {
      console.error("Erro na autenticação:", authError);
      return NextResponse.json(
        { error: `Erro de autenticação: ${authError.message}` },
        { status: 500 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (action === "populate") {
      const result = await populateSampleData(session.user.accountId);
      return NextResponse.json(result);
    } else if (action === "clear") {
      const result = await clearSampleData(session.user.accountId);
      return NextResponse.json(result);
    } else if (action === "check") {
      const exists = await hasSampleData(session.user.accountId);
      return NextResponse.json({ exists });
    } else {
      return NextResponse.json(
        { error: "Ação inválida" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Erro na API de dados de exemplo:", error);

    // Identificar tipo de erro
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Dados duplicados encontrados" },
        { status: 409 }
      );
    }

    if (error.code?.startsWith("P")) {
      return NextResponse.json(
        { error: `Erro de banco de dados: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
