/*
  Warnings:

  - Added the required column `quantity` to the `RepairItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" REAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "clientId" INTEGER,
    "clientName" TEXT,
    "clientPhone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("clientId", "createdAt", "date", "id", "number", "supplierId", "total", "updatedAt") SELECT "clientId", "createdAt", "date", "id", "number", "supplierId", "total", "updatedAt" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");
CREATE TABLE "new_Repair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER,
    "clientName" TEXT,
    "clientPhone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Repair_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Repair" ("clientId", "createdAt", "id") SELECT "clientId", "createdAt", "id" FROM "Repair";
DROP TABLE "Repair";
ALTER TABLE "new_Repair" RENAME TO "Repair";
CREATE TABLE "new_RepairItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repairId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "RepairItem_repairId_fkey" FOREIGN KEY ("repairId") REFERENCES "Repair" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RepairItem" ("id", "name", "price", "repairId", "unit") SELECT "id", "name", "price", "repairId", "unit" FROM "RepairItem";
DROP TABLE "RepairItem";
ALTER TABLE "new_RepairItem" RENAME TO "RepairItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
