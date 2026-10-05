import FormPageShell from "@/components/General/FormPageShell";
import CreateInvoiceForm from "@/components/Invoices/CreateInvoicesForm/CreateInvoiceForm";
import Error from "@/components/Error";
import { getServerLabels } from "@/lib/i18n";
import { invoiceService } from "@/modules/invoices/service";
import { redirect } from "next/navigation";

const EditInvoicePage = async ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  const data = await getServerLabels();
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
      title={data.invoices.editPageTitle}
      backHref="/auth/invoices"
      backLabel={data.invoices.backToInvoices}
    >
      <CreateInvoiceForm invoice={invoice} editMode />
    </FormPageShell>
  );
};

export default EditInvoicePage;
