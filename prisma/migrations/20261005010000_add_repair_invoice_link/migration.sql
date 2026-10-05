-- Add an optional one-to-one link from an invoice to a repair.

CREATE TYPE "RepairStatus" AS ENUM ('Open', 'Closed');

ALTER TABLE "Repair" ADD COLUMN "status" "RepairStatus" NOT NULL DEFAULT 'Open';

ALTER TABLE "Invoice" ADD COLUMN "repairId" INTEGER;

CREATE UNIQUE INDEX "Invoice_repairId_key" ON "Invoice"("repairId");

ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_repairId_fkey"
    FOREIGN KEY ("repairId") REFERENCES "Repair"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
