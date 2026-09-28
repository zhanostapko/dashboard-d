import { redirect } from "next/navigation";

const ClientDetailPage = () => {
  redirect("/auth");
  return null;
};

export default ClientDetailPage;
