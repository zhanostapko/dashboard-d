-- AlterTable
ALTER TABLE "Client" ADD COLUMN "account" TEXT;
ALTER TABLE "Client" ADD COLUMN "bank" TEXT;
ALTER TABLE "Client" ADD COLUMN "bankCode" TEXT;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN "clientAccount" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "clientAddress" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "clientBank" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "clientBankCode" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "clientEmail" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "clientRegNr" TEXT;
