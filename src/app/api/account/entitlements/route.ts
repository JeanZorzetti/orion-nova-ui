import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { entitlements } from "@/lib/account";

/**
 * GET /api/account/entitlements - o que o plano da conta libera.
 *
 * Existe porque as telas do dashboard são client components e precisam saber o
 * que mostrar (botão de exportar, aviso de cota) sem consultar o Prisma no
 * navegador.
 *
 * ponytail: gate de UI, não de segurança. O export dos relatórios é montado no
 * cliente a partir de dados que ele já recebeu, então esconder o botão não
 * impede ninguém decidido. Vira gate de verdade no dia em que a exportação
 * passar a ser gerada no servidor.
 */
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  return NextResponse.json(await entitlements(session.user.accountId));
}
