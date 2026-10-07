ALTER TABLE "RepairItem"
  ALTER COLUMN "price" TYPE DECIMAL(12, 2) USING ROUND("price"::numeric, 2);

ALTER TABLE "RepairItem" DROP CONSTRAINT IF EXISTS "RepairItem_repairId_fkey";

ALTER TABLE "RepairItem"
  ADD CONSTRAINT "RepairItem_repairId_fkey"
  FOREIGN KEY ("repairId") REFERENCES "Repair"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
