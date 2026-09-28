import { redirect } from "next/navigation";

const ClientsPage = () => {
  redirect("/auth");
  return null;
};

export default ClientsPage;
