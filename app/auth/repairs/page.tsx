import { redirect } from "next/navigation";

const RepairsPage = () => {
  // Temporarily disabled during the focused users/auth/shared refactor.
  redirect("/auth");
};

export default RepairsPage;
