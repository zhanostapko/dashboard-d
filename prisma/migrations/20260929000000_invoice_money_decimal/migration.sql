ALTER TABLE "Invoice"
  ALTER COLUMN "total" TYPE DECIMAL(12, 2) USING ROUND("total"::numeric, 2);

ALTER TABLE "InvoiceItem"
  ALTER COLUMN "price" TYPE DECIMAL(12, 2) USING ROUND("price"::numeric, 2),
  ALTER COLUMN "total" TYPE DECIMAL(12, 2) USING ROUND("total"::numeric, 2);
