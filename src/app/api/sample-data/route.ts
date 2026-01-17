import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { populateSampleData, clearSampleData, hasSampleData } from "@/lib/sample-data";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (action === "populate") {
      const result = await populateSampleData(session.user.id);
      return NextResponse.json(result);
    } else if (action === "clear") {
      const result = await clearSampleData(session.user.id);
      return NextResponse.json(result);
    } else if (action === "check") {
      const exists = await hasSampleData(session.user.id);
      return NextResponse.json({ exists });
    } else {
      return NextResponse.json(
        { error: "Ação inválida" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Erro na API de dados de exemplo:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
