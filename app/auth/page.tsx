import { redirect } from "next/navigation";

const page = () => {
  redirect("/auth/invoices");
  return null;
};

export default page;
