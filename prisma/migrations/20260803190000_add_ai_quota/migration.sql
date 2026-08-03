-- Cota mensal da Orion AI, contada no dono da conta.
-- aiMessagesPeriod guarda o mês ("2026-08") a que aiMessagesUsed se refere:
-- quando o mês muda, o contador zera na próxima mensagem, sem cron.
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "aiMessagesPeriod" TEXT,
ADD COLUMN     "aiMessagesUsed" INTEGER NOT NULL DEFAULT 0;
