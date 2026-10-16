# Dashboard MVP

Internal MVP dashboard for a small team. The active MVP scope is:

- Google login with allowlisted users from the `User` table
- Repairs CRUD
- Invoices CRUD
- Mark invoice as paid
- Invoice PDF generation

Clients and users remain in the codebase, but they are not part of the main MVP navigation.

## Stack

- Next.js App Router
- Prisma
- PostgreSQL
- NextAuth Google provider
- Tailwind + shadcn/ui

## Environment

Copy `.env.example` to `.env.local` for local development, then fill the values.
In production, configure the same variables in the hosting provider's environment settings.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:55432/app?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-random-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_NAME="Admin"
SEED_ADMIN_SURNAME="User"

DEFAULT_SUPPLIER_NAME=""
DEFAULT_SUPPLIER_REG_NR=""
DEFAULT_SUPPLIER_BANK=""
DEFAULT_SUPPLIER_BANK_CODE=""
DEFAULT_SUPPLIER_ACCOUNT=""
DEFAULT_SUPPLIER_PHONE=""
```

`SEED_ADMIN_EMAIL` is important. Login only works for emails that already exist in the `User` table.

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Start PostgreSQL.

```bash
docker-compose up -d
```

3. Run Prisma migrations.

```bash
npm run db:migrate
```

4. Fill `DEFAULT_SUPPLIER_*`, then seed the default supplier and first admin user.

```bash
npm run db:seed
```

5. Start the app.

```bash
npm run dev
```

Open `http://localhost:3000` and sign in with the seeded admin email.

## MVP Smoke Checklist

1. Sign in with a Google account that matches `SEED_ADMIN_EMAIL`.
2. Open `/auth/repairs`, then create, edit, and delete a repair.
3. Open `/auth/invoices`, then create, edit, and delete an unpaid invoice.
4. Mark an invoice as paid and confirm it can still be viewed.
5. Open the invoice detail page and generate the PDF.
6. Run `npm run build` before shipping changes.

## Notes

- Before the first production deployment, fill `DEFAULT_SUPPLIER_*` in the production environment. Run `npm run db:seed` after migrations. The seed creates the supplier only when the `Supplier` table is empty; later runs leave the existing supplier unchanged.
- API routes now return JSON `401/403` errors instead of redirecting to `/login`.
- If this branch cannot stay build-green and smoke-test clean after hardening, the fallback plan is to reduce the app to a login shell and rebuild the domain UI from there.
