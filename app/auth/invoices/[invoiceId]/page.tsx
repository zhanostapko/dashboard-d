import { redirect } from "next/navigation";

const InvoiceDetailPage = async ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  await params;
  // Temporarily disabled during the focused users/auth/shared refactor.
  redirect("/auth");
};

export default InvoiceDetailPage;
