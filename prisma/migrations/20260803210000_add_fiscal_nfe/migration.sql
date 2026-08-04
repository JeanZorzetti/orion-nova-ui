-- CreateEnum
CREATE TYPE "RegimeTributario" AS ENUM ('SIMPLES_NACIONAL', 'SIMPLES_NACIONAL_EXCESSO', 'REGIME_NORMAL', 'MEI');

-- CreateEnum
CREATE TYPE "AmbienteFiscal" AS ENUM ('HOMOLOGACAO', 'PRODUCAO');

-- CreateEnum
CREATE TYPE "IndicadorIeDestinatario" AS ENUM ('CONTRIBUINTE', 'ISENTO', 'NAO_CONTRIBUINTE');

-- CreateEnum
CREATE TYPE "NotaFiscalStatus" AS ENUM ('PENDENTE', 'AUTORIZADA', 'REJEITADA', 'CANCELADA');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "ambienteNfe" "AmbienteFiscal" NOT NULL DEFAULT 'HOMOLOGACAO',
ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "cnae" TEXT,
ADD COLUMN     "codigoMunicipioIBGE" TEXT,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "focusNfeCnpj" TEXT,
ADD COLUMN     "focusNfeConectadoEm" TIMESTAMP(3),
ADD COLUMN     "focusNfeToken" TEXT,
ADD COLUMN     "inscricaoEstadual" TEXT,
ADD COLUMN     "inscricaoMunicipal" TEXT,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "proximoNumeroNfe" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "regimeTributario" "RegimeTributario",
ADD COLUMN     "serieNfe" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "codigoMunicipioIBGE" TEXT,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "indIEDest" "IndicadorIeDestinatario",
ADD COLUMN     "inscricaoEstadual" TEXT,
ADD COLUMN     "numero" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "aliquotaIcms" DECIMAL(5,2),
ADD COLUMN     "cest" TEXT,
ADD COLUMN     "cfop" TEXT DEFAULT '5102',
ADD COLUMN     "csosn" TEXT,
ADD COLUMN     "cstIcms" TEXT,
ADD COLUMN     "cstPisCofins" TEXT,
ADD COLUMN     "ncm" TEXT,
ADD COLUMN     "origem" TEXT DEFAULT '0',
ADD COLUMN     "unidadeTributavel" TEXT;

-- CreateTable
CREATE TABLE "notas_fiscais" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "NotaFiscalStatus" NOT NULL DEFAULT 'PENDENTE',
    "ambiente" "AmbienteFiscal" NOT NULL DEFAULT 'HOMOLOGACAO',
    "numero" INTEGER,
    "serie" INTEGER,
    "chaveAcesso" TEXT,
    "protocolo" TEXT,
    "xmlUrl" TEXT,
    "danfeUrl" TEXT,
    "providerRef" TEXT,
    "motivoRejeicao" TEXT,
    "emitidaEm" TIMESTAMP(3),
    "canceladaEm" TIMESTAMP(3),
    "justificativaCancelamento" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notas_fiscais_chaveAcesso_key" ON "notas_fiscais"("chaveAcesso");

-- CreateIndex
CREATE UNIQUE INDEX "notas_fiscais_providerRef_key" ON "notas_fiscais"("providerRef");

-- CreateIndex
CREATE INDEX "notas_fiscais_orderId_idx" ON "notas_fiscais"("orderId");

-- CreateIndex
CREATE INDEX "notas_fiscais_userId_idx" ON "notas_fiscais"("userId");

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "sales_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

