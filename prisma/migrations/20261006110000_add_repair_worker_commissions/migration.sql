CREATE TYPE "PaymentStatus" AS ENUM ('Paid', 'Unpaid');

ALTER TABLE "User"
ADD COLUMN "baseRate" DECIMAL(5, 2) NOT NULL DEFAULT 0;

ALTER TABLE "Invoice"
ADD COLUMN "paidAt" TIMESTAMP(3);

ALTER TABLE "Repair"
ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'Unpaid',
ADD COLUMN "paidAt" TIMESTAMP(3),
ADD COLUMN "closedAt" TIMESTAMP(3);

CREATE TABLE "RepairWorker" (
    "id" SERIAL NOT NULL,
    "repairId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rate" DECIMAL(5, 2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairWorker_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RepairWorker_repairId_userId_key"
ON "RepairWorker"("repairId", "userId");

CREATE INDEX "RepairWorker_userId_idx" ON "RepairWorker"("userId");
CREATE INDEX "RepairWorker_repairId_idx" ON "RepairWorker"("repairId");

ALTER TABLE "RepairWorker"
ADD CONSTRAINT "RepairWorker_repairId_fkey"
FOREIGN KEY ("repairId") REFERENCES "Repair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RepairWorker"
ADD CONSTRAINT "RepairWorker_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
