import FormPageShell from "@/components/General/FormPageShell";
import CreateInvoiceForm from "@/components/Invoices/CreateInvoicesForm/CreateInvoiceForm";
import Error from "@/components/Error";
import data from "@/data/labels.json";
import { invoiceService } from "@/modules/invoices/service";
import { redirect } from "next/navigation";

const EditInvoicePage = async ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  const { invoiceId } = await params;
  const invoice = await invoiceService.getInvoice(Number(invoiceId));

  if (!invoice) {
    return <Error />;
  }

  if (invoice.status === "Paid") {
    redirect(`/auth/invoices/${invoice.id}`);
  }

  return (
    <FormPageShell
      title={data.ru.invoices.editPageTitle}
      backHref="/auth/invoices"
      backLabel={data.ru.invoices.backToInvoices}
    >
      <CreateInvoiceForm invoice={invoice} editMode />
    </FormPageShell>
  );
};

export default EditInvoicePage;
