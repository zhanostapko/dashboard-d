import React from "react";
import CreateRepairForm from "@/components/Repairs/CreateRepairForm/CreateRepairForm";
import FormPageShell from "@/components/General/FormPageShell";
import { getServerLabels } from "@/lib/i18n";
import { requirePageUser } from "@/lib/authz";
import { clientService } from "@/modules/clients/service";

const NewRepairPage = async () => {
  await requirePageUser();
  const labelsData = await getServerLabels();
  const clients = await clientService.getAllClients();

  return (
    <FormPageShell
      title={labelsData.repairs.createPageTitle}
      backHref="/auth/repairs"
      backLabel={labelsData.repairs.backToRepairs}
    >
      <CreateRepairForm clients={clients} />
    </FormPageShell>
  );
};

export default NewRepairPage;
