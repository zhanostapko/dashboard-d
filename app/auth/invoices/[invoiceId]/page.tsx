import EditInvoiceButton from "@/components/invoices/EditInvoiceButton";
import GeneratePDFButton from "@/components/invoices/GeneratePDFButton";
import { Card, CardContent } from "@/components/ui/card";
import { getInvoiceDetails } from "@/lib/invoices";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { format } from "date-fns";
import DeleteInvoiceButton from "@/components/invoices/DeleteInvoiceButton";
import Error from "@/components/Error";
import data from "@/data/labels.json";

const { total, invoiceForm, date } = data.ru.invoices;

const { formInvoiceNumber, clientInformation, carInformation, invoiceItems } =
  invoiceForm;

const {
  clientName,
  account,
  address,
  phone,
  email,
  bank,
  bankCode,
  cash,
  clientRegistrationNumber,
  nonCash,
  paymentType,
  title,
} = clientInformation;

const { brand, mileage, model, plate, title: carTitle } = carInformation;

const {
  name,
  price,
  quantity,
  sum,
  title: invoiceItemsTitle,
  type,
} = invoiceItems;

const InvoiceDetailPage = async ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  let invoice;
  const { invoiceId } = await params;
  try {
    invoice = await getInvoiceDetails(Number(invoiceId));
  } catch (error) {
    console.log(error);
    return <Error />;
  }

  if (!invoice)
    return (
      <div className="text-center text-2xl font-semibold">
        Invoice not found
      </div>
    );

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-1">
              {formInvoiceNumber} {invoice.number}
            </h2>
            <div className="flex gap-2 justify-between">
              <GeneratePDFButton invoice={invoice} />
              <div className="flex gap-2">
                <EditInvoiceButton invoice={invoice} />
                <DeleteInvoiceButton invoice={invoice} />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-sm mb-1">{date}*</label>
            <div className="flex items-center border rounded-md px-3 py-2 min-w-[250px] bg-white shadow-sm">
              <span className="text-gray-800 font-medium">
                {format(new Date(invoice.date), "MM/dd/yyyy")}
              </span>
              <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DisplayField label={`${clientName}*`} value={invoice.clientName} />
            <DisplayField
              label={`${clientRegistrationNumber}*`}
              value={invoice.clientRegNr}
            />
            <DisplayField label={`${address}*`} value={invoice.clientAddress} />
            <DisplayField label={`${email}`} value={invoice.clientEmail} />
            <DisplayField label={`${phone}`} value={invoice.clientPhone} />
            <DisplayField label={`${bank}*`} value={invoice.clientBank} />
            <DisplayField
              label={`${bankCode}*`}
              value={invoice.clientBankCode}
            />
            <DisplayField label={`${account}*`} value={invoice.clientAccount} />
            <DisplayField
              label={`${paymentType}*`}
              value={invoice.paymentType === "Cash" ? `${cash}` : `${nonCash}`}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">{carTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DisplayField label={`${brand}*`} value={invoice.carBrand} />
            <DisplayField label={`${model}*`} value={invoice.carModel} />
            <DisplayField label={`${plate}*`} value={invoice.carPlate} />
            <DisplayField label={`${mileage}`} value={invoice.carMileage} />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">{invoiceItemsTitle}*</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">{name}</th>
                  <th className="text-left py-2 px-3">{type}</th>
                  <th className="text-left py-2 px-3">{quantity}</th>
                  <th className="text-left py-2 px-3">{price}</th>
                  <th className="text-left py-2 px-3">{sum}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-3 text-gray-800 font-medium">
                        {item.name}
                      </td>
                      <td className="py-2 px-3 text-gray-800 font-medium">
                        {item.unit}
                      </td>
                      <td className="py-2 px-3 text-gray-800 font-medium">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-3 text-gray-800 font-medium">
                        {item.price.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-gray-800 font-medium">
                        {item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-center text-muted-foreground"
                    >
                      No items added.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <h2 className="font-bold text-2xl py-2">{`${total}: ${invoice.total}`}</h2>
        </div>
      </CardContent>
    </Card>
  );
};

const DisplayField = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div>
    <p className="text-sm font-medium mb-1">{label}</p>
    <div className="bg-muted px-4 py-2 rounded shadow-sm text-gray-800 font-medium border border-gray-200">
      {value || "-"}
    </div>
  </div>
);

export default InvoiceDetailPage;
