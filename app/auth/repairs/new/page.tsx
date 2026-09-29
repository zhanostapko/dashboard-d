import React from "react";
import CreateRepairForm from "@/components/Repairs/CreateRepairForm/CreateRepairForm";
import FormPageShell from "@/components/General/FormPageShell";
import labelsData from "@/data/labels.json";
import { requirePageUser } from "@/lib/authz";
import { clientService } from "@/modules/clients/service";

const NewRepairPage = async () => {
  await requirePageUser();
  const clients = await clientService.getAllClients();

  return (
    <FormPageShell
      title={labelsData.ru.repairs.createPageTitle}
      backHref="/auth/repairs"
      backLabel={labelsData.ru.repairs.backToRepairs}
    >
      <CreateRepairForm clients={clients} />
    </FormPageShell>
  );
};

export default NewRepairPage;
