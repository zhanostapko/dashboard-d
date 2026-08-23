import FormPageShell from "@/components/General/FormPageShell";
import CreateRepairForm from "@/components/Repairs/CreateRepairForm/CreateRepairForm";
import Error from "@/components/Error";
import data from "@/data/labels.json";
import { repairService } from "@/modules/repairs/service";

const EditRepairPage = async ({
  params,
}: {
  params: Promise<{ repairId: string }>;
}) => {
  const { repairId } = await params;
  const repair = await repairService.getRepairById(Number(repairId));

  if (!repair) {
    return <Error />;
  }

  return (
    <FormPageShell
      title={data.ru.repairs.editPageTitle}
      backHref="/auth/repairs"
      backLabel={data.ru.repairs.backToRepairs}
    >
      <CreateRepairForm repair={repair} editMode />
    </FormPageShell>
  );
};

export default EditRepairPage;
