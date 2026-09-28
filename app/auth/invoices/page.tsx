import { redirect } from "next/navigation";

const InvoicesPage = () => {
  // Temporarily disabled during the focused users/auth/shared refactor.
  redirect("/auth");
};

export default InvoicesPage;
