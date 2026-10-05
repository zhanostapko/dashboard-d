import FormPageShell from "@/components/General/FormPageShell";
import CreateInvoiceForm, {
  InvoicePrefill,
} from "@/components/Invoices/CreateInvoicesForm/CreateInvoiceForm";
import data from "@/data/labels.json";
import { repairService } from "@/modules/repairs/service";
import { clientService } from "@/modules/clients/service";

const NewInvoicePage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ repairId?: string }>;
}) => {
  const query = await searchParams;
  const repairId = Number(query?.repairId);
  let prefill: InvoicePrefill | undefined;

  if (Number.isInteger(repairId) && repairId > 0) {
    const repair = await repairService.getRepairById(repairId);
    const client = repair?.clientId
      ? await clientService.getClientById(repair.clientId)
      : null;

    if (repair && repair.status === "Open" && !repair.invoiceId) {
      prefill = {
        repairId: repair.id,
        date: repair.date,
        clientName: repair.clientName,
        clientRegNr: client?.regNr ?? "",
        clientAddress: client?.address ?? "",
        clientBank: client?.bank ?? "",
        clientBankCode: client?.bankCode ?? "",
        clientAccount: client?.account ?? "",
        clientPhone: repair.clientPhone || client?.phone || "",
        clientEmail: client?.email ?? "",
        carBrand: repair.carBrand,
        carModel: repair.carModel,
        carPlate: repair.carPlate ?? "",
        carMileage: repair.carMileage ?? "",
        items: repair.items
          .filter((item) => item.price > 0)
          .map((item) => ({
          id: item.id,
          name: item.name,
          unit: item.unit,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
          })),
      };
    }
  }

  return (
    <FormPageShell
      title={data.ru.invoices.createPageTitle}
      backHref="/auth/invoices"
      backLabel={data.ru.invoices.backToInvoices}
    >
      <CreateInvoiceForm prefill={prefill} />
    </FormPageShell>
  );
};

export default NewInvoicePage;
