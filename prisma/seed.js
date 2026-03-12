const { PrismaClient, Role } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedSupplier() {
  const existingSupplier = await prisma.supplier.findFirst({
    orderBy: { id: "asc" },
  });

  if (existingSupplier) {
    return existingSupplier;
  }

  return prisma.supplier.create({
    data: {
      name: process.env.DEFAULT_SUPPLIER_NAME || "MVP Supplier",
      regNr: process.env.DEFAULT_SUPPLIER_REG_NR || "00000000000",
      bank: process.env.DEFAULT_SUPPLIER_BANK || "MVP Bank",
      code: process.env.DEFAULT_SUPPLIER_BANK_CODE || "MVPBANK",
      account: process.env.DEFAULT_SUPPLIER_ACCOUNT || "LV00MVP0000000000000",
      phone: process.env.DEFAULT_SUPPLIER_PHONE || null,
    },
  });
}

async function seedAdmin() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;

  if (!adminEmail) {
    return null;
  }

  return prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: process.env.SEED_ADMIN_NAME || "Admin",
      surname: process.env.SEED_ADMIN_SURNAME || "User",
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      name: process.env.SEED_ADMIN_NAME || "Admin",
      surname: process.env.SEED_ADMIN_SURNAME || "User",
      role: Role.ADMIN,
    },
  });
}

async function main() {
  const supplier = await seedSupplier();
  const admin = await seedAdmin();

  console.log(`Seeded supplier #${supplier.id}`);

  if (admin) {
    console.log(`Seeded admin ${admin.email}`);
  } else {
    console.log("Skipped admin seed because SEED_ADMIN_EMAIL is not set.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
