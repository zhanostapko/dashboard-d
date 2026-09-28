import { redirect } from "next/navigation";

const NewInvoicePage = () => {
  // Temporarily disabled during the focused users/auth/shared refactor.
  redirect("/auth");
};

export default NewInvoicePage;
