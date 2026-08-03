/**
 * Aplica prisma/plans.ts no banco. Idempotente: rodar de novo não faz nada.
 *
 * Existe porque o seed usa `update: {}` — as linhas que já estão em produção
 * nunca mudam sozinhas. Sucessor do strip-nfe-from-plans.ts, que resolvia só o
 * caso da NF-e.
 *
 * Uso:  npx tsx --env-file=.env scripts/sync-plans.ts
 *       npx tsx --env-file=.env scripts/sync-plans.ts --dry
 */
import { PrismaClient } from "@prisma/client";
import { syncPlans } from "../prisma/plans";

const prisma = new PrismaClient();

syncPlans(prisma, { dry: process.argv.includes("--dry") })
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
