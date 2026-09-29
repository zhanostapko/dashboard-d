import React from "react";
import { redirect } from "next/navigation";
import CreateRepairForm from "@/components/Repairs/CreateRepairForm/CreateRepairForm";
import FormPageShell from "@/components/General/FormPageShell";
import labelsData from "@/data/labels.json";
import { requirePageUser } from "@/lib/authz";
import { clientService } from "@/modules/clients/service";
import { repairService } from "@/modules/repairs/service";

const EditRepairPage = async ({
  params,
}: {
  params: Promise<{ repairId: string }>;
}) => {
  await requirePageUser();

  const { repairId } = await params;
  const id = Number(repairId);

  if (!Number.isInteger(id)) {
    redirect("/auth/repairs");
  }

  const [repair, clients] = await Promise.all([
    repairService.getRepairById(id),
    clientService.getAllClients(),
  ]);

  if (!repair) {
    redirect("/auth/repairs");
  }

  return (
    <FormPageShell
      title={labelsData.ru.repairs.editPageTitle}
      backHref={`/auth/repairs/${repair.id}`}
      backLabel={labelsData.ru.repairs.backToRepairs}
    >
      <CreateRepairForm clients={clients} editMode repair={repair} />
    </FormPageShell>
  );
};

export default EditRepairPage;
