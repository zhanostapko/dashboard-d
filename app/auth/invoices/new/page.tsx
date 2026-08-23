import FormPageShell from "@/components/General/FormPageShell";
import CreateInvoiceForm from "@/components/Invoices/CreateInvoicesForm/CreateInvoiceForm";
import data from "@/data/labels.json";

const NewInvoicePage = () => {
  return (
    <FormPageShell
      title={data.ru.invoices.createPageTitle}
      backHref="/auth/invoices"
      backLabel={data.ru.invoices.backToInvoices}
    >
      <CreateInvoiceForm />
    </FormPageShell>
  );
};

export default NewInvoicePage;
