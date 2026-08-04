-- CreateEnum
CREATE TYPE "TipoNota" AS ENUM ('NFE', 'NFSE');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "proximoNumeroDps" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "serieDps" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "notas_fiscais" ADD COLUMN     "tipo" "TipoNota" NOT NULL DEFAULT 'NFE';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "aliquotaIss" DECIMAL(5,2),
ADD COLUMN     "codigoTributacaoNacionalISS" TEXT;
