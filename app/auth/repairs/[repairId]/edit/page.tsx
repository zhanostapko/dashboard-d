import { redirect } from "next/navigation";

const EditRepairPage = async ({
  params,
}: {
  params: Promise<{ repairId: string }>;
}) => {
  await params;
  // Temporarily disabled during the focused users/auth/shared refactor.
  redirect("/auth");
};

export default EditRepairPage;
