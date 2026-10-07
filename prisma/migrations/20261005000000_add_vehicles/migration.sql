-- Add vehicles as a reusable entity linked to clients and repairs.

CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "plate" TEXT,
    "vin" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Repair" ADD COLUMN "vehicleId" INTEGER;

ALTER TABLE "Repair" ADD CONSTRAINT "Repair_vehicleId_fkey"
    FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "_ClientVehicles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

CREATE UNIQUE INDEX "_ClientVehicles_AB_unique" ON "_ClientVehicles"("A", "B");
CREATE INDEX "_ClientVehicles_B_index" ON "_ClientVehicles"("B");

ALTER TABLE "_ClientVehicles" ADD CONSTRAINT "_ClientVehicles_A_fkey"
    FOREIGN KEY ("A") REFERENCES "Client"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_ClientVehicles" ADD CONSTRAINT "_ClientVehicles_B_fkey"
    FOREIGN KEY ("B") REFERENCES "Vehicle"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
