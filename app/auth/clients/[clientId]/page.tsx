import { redirect } from "next/navigation";

const ClientDetailPage = () => {
  redirect("/auth/invoices");
  return null;
};

export default ClientDetailPage;
