-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" REAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "clientId" INTEGER,
    "clientName" TEXT,
    "clientRegNr" TEXT,
    "clientAddress" TEXT,
    "clientEmail" TEXT,
    "clientPhone" TEXT,
    "clientBank" TEXT,
    "clientBankCode" TEXT,
    "clientAccount" TEXT,
    "carBrand" TEXT NOT NULL DEFAULT '',
    "carModel" TEXT NOT NULL DEFAULT '',
    "carPlate" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'EDITABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("carBrand", "carModel", "carPlate", "clientAccount", "clientAddress", "clientBank", "clientBankCode", "clientEmail", "clientId", "clientName", "clientPhone", "clientRegNr", "createdAt", "date", "id", "number", "status", "supplierId", "total", "updatedAt") SELECT "carBrand", "carModel", "carPlate", "clientAccount", "clientAddress", "clientBank", "clientBankCode", "clientEmail", "clientId", "clientName", "clientPhone", "clientRegNr", "createdAt", "date", "id", "number", "status", "supplierId", "total", "updatedAt" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
