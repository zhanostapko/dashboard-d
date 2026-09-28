import { redirect } from "next/navigation";

const EditInvoicePage = async ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  await params;
  // Temporarily disabled during the focused users/auth/shared refactor.
  redirect("/auth");
};

export default EditInvoicePage;
