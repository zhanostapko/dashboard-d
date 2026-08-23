import prisma from "./db";

export const DEFAULT_SUPPLIER_ERROR =
  "No supplier is configured. Run `npm run db:seed` before creating invoices.";

export const getDefaultSupplierId = async (): Promise<number> => {
  const supplier = await prisma.supplier.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });

  if (!supplier) {
    throw new Error(DEFAULT_SUPPLIER_ERROR);
  }

  return supplier.id;
};
