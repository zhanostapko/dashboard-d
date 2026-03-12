import { redirect } from "next/navigation";

const ClientsPage = () => {
  redirect("/auth/invoices");
  return null;
};

export default ClientsPage;
