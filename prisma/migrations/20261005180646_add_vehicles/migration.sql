-- AlterTable
ALTER TABLE "_ClientVehicles" ADD CONSTRAINT "_ClientVehicles_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ClientVehicles_AB_unique";
