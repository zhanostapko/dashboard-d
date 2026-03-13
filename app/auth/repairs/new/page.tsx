import FormPageShell from "@/components/General/FormPageShell";
import CreateRepairForm from "@/components/Repairs/CreateRepairForm/CreateRepairForm";
import data from "@/data/labels.json";

const NewRepairPage = () => {
  return (
    <FormPageShell
      title={data.ru.repairs.createPageTitle}
      backHref="/auth/repairs"
      backLabel={data.ru.repairs.backToRepairs}
    >
      <CreateRepairForm />
    </FormPageShell>
  );
};

export default NewRepairPage;
