/*
  Warnings:

  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoiceItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Repair` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RepairItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Repair" DROP CONSTRAINT "Repair_clientId_fkey";

-- DropForeignKey
ALTER TABLE "RepairItem" DROP CONSTRAINT "RepairItem_repairId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "InvoiceItem";

-- DropTable
DROP TABLE "Repair";

-- DropTable
DROP TABLE "RepairItem";

-- DropTable
DROP TABLE "Supplier";

-- DropEnum
DROP TYPE "InvoiceStatus";

-- DropEnum
DROP TYPE "PaymentType";
