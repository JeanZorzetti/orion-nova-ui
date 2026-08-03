/**
 * Tira a promessa de NF-e/NFS-e dos planos já gravados no banco.
 *
 * Emissão fiscal não existe no produto (a tela de Fiscal diz "Em
 * desenvolvimento"), mas /precos renderiza plans.features.modules direto do
 * banco — ou seja, o Starter vende hoje "Emissão de NF-e (até 100/mês)".
 * O seed já foi corrigido, mas ele usa `update: {}`: as linhas que existem em
 * produção não mudam sozinhas.
 *
 * Uso:  DATABASE_URL="postgresql://..." npx tsx scripts/strip-nfe-from-plans.ts
 * É idempotente — rodar de novo não faz nada.
 */
import { PrismaClient, Prisma } from "@prisma/client";

const NFE = /nf-?e|nfs-?e|nota fiscal/i;

/** Remove os módulos que prometem emissão fiscal e a chave nfeLimit. */
export function stripNfe(features: unknown): Record<string, unknown> | null {
  if (!features || typeof features !== "object" || Array.isArray(features)) {
    return null;
  }
  const { nfeLimit, ...rest } = features as Record<string, unknown>;
  const modules = Array.isArray(rest.modules)
    ? rest.modules.filter((m) => typeof m !== "string" || !NFE.test(m))
    : rest.modules;

  const changed =
    nfeLimit !== undefined ||
    (Array.isArray(modules) &&
      modules.length !== (rest.modules as unknown[]).length);

  return changed ? { ...rest, ...(modules !== undefined && { modules }) } : null;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const plans = await prisma.plan.findMany({
      select: { id: true, slug: true, features: true },
    });

    for (const plan of plans) {
      const features = stripNfe(plan.features);
      if (!features) {
        console.log(`= ${plan.slug}: sem menção a NF-e`);
        continue;
      }
      await prisma.plan.update({
        where: { id: plan.id },
        data: { features: features as Prisma.InputJsonValue },
      });
      console.log(`✔ ${plan.slug}: atualizado ->`, features.modules);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// tsx roda o arquivo direto; o teste importa só stripNfe.
if (process.argv[1]?.includes("strip-nfe-from-plans")) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
