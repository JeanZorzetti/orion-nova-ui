-- Preferências de notificação: os 3 toggles de /dashboard/configuracoes/notificacoes
-- eram <input type="checkbox"> sem destino. Default true preserva o que a tela
-- já mostrava (todos ligados).
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "notifyNewOrders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyLowStock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyDueBills" BOOLEAN NOT NULL DEFAULT true;

-- Tipo de dados da migração: o select existia na UI e era descartado no POST.
-- CreateEnum
CREATE TYPE "MigrationDataType" AS ENUM ('CUSTOMERS', 'PRODUCTS', 'ALL');

-- AlterTable
ALTER TABLE "data_migrations" ADD COLUMN     "dataType" "MigrationDataType" NOT NULL DEFAULT 'ALL';
