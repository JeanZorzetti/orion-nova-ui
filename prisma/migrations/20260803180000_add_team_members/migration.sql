-- Equipe: um membro aponta para o dono da conta (ownerId). O dono tem NULL.
-- Nenhuma tabela do ERP muda: os dados seguem gravados no id do dono.
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ownerId" TEXT;

-- CreateIndex
CREATE INDEX "users_ownerId_idx" ON "users"("ownerId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
