const { PrismaClient, Role } = require("@prisma/client");

const prisma = new PrismaClient();

function requiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} must be set before seeding the default supplier.`);
  }

  return value;
}

async function seedSupplier() {
  const existingSupplier = await prisma.supplier.findFirst({
    orderBy: { id: "asc" },
  });

  if (existingSupplier) {
    return existingSupplier;
  }

  return prisma.supplier.create({
    data: {
      name: requiredEnv("DEFAULT_SUPPLIER_NAME"),
      regNr: requiredEnv("DEFAULT_SUPPLIER_REG_NR"),
      bank: requiredEnv("DEFAULT_SUPPLIER_BANK"),
      code: requiredEnv("DEFAULT_SUPPLIER_BANK_CODE"),
      account: requiredEnv("DEFAULT_SUPPLIER_ACCOUNT"),
      phone: process.env.DEFAULT_SUPPLIER_PHONE?.trim() || null,
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
