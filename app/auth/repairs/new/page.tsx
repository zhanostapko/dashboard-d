import { redirect } from "next/navigation";

const NewRepairPage = () => {
  // Temporarily disabled during the focused users/auth/shared refactor.
  redirect("/auth");
};

export default NewRepairPage;
