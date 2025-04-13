import EditInvoiceButton from "@/components/EditInvoiceButton";
import GeneratePDFButton from "@/components/GeneratePDFButton";
import InvoicePDFTemplate from "@/components/InvoicePDFTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInvoice } from "@/lib/invoices";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { format } from "date-fns";

type Props = {};

const InvoiceDetailPage = async ({
  params,
}: {
  params: { invoiceId: string };
}) => {
  const invoice = await getInvoice(Number(params.invoiceId));

  console.log(invoice, "invoice test");

  if (!invoice) return <div>Invoice not found</div>;

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Create Invoice</h2>
            <EditInvoiceButton invoice={invoice} />
            <GeneratePDFButton invoice={invoice} />
            <p className="text-lg text-muted-foreground">
              Invoice Number {invoice.number}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-sm mb-1">Date*</label>
            <div className="flex items-center border rounded-md px-3 py-2 min-w-[250px]">
              <span className="text-muted-foreground">
                {format(new Date(invoice.date), "MM/dd/yyyy")}
              </span>
              <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Client information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-1">Client Name*</p>
              <div className="border px-3 py-2 rounded-md text-muted-foreground">
                {invoice.clientName || "-"}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">
                Client registration number*
              </p>
              <div className="border px-3 py-2 rounded-md text-muted-foreground">
                {invoice.clientRegNr || "-"}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Address*</p>
              <div className="border px-3 py-2 rounded-md text-muted-foreground">
                {invoice.clientAddress || "-"}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Client Email</p>
              <div className="border px-3 py-2 rounded-md text-muted-foreground">
                {invoice.clientEmail || "-"}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Client Phone</p>
              <div className="border px-3 py-2 rounded-md text-muted-foreground">
                {invoice.clientPhone || "-"}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Bank*</p>
              <div className="border px-3 py-2 rounded-md text-muted-foreground">
                {invoice.clientBank || "-"}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Bank code*</p>
              <div className="border px-3 py-2 rounded-md text-muted-foreground">
                {invoice.clientBankCode || "-"}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Account*</p>
              <div className="border px-3 py-2 rounded-md text-muted-foreground">
                {invoice.clientAccount || "-"}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Car information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium mb-1">Brand*</p>
              <div className="border px-3 py-2 rounded-md text-muted-foreground">
                {invoice.carBrand || "-"}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Model*</p>
              <div className="border px-3 py-2 rounded-md text-muted-foreground">
                {invoice.carModel || "-"}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Plate*</p>
              <div className="border px-3 py-2 rounded-md text-muted-foreground">
                {invoice.carPlate || "-"}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Invoice Items*</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Name</th>
                  <th className="text-left py-2 px-3">Type</th>
                  <th className="text-left py-2 px-3">Qty</th>
                  <th className="text-left py-2 px-3">Price</th>
                  <th className="text-left py-2 px-3">Summ</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-3 text-muted-foreground">
                        {item.name}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {item.unit}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {item.price.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
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
      </CardContent>
    </Card>
  );
};

export default InvoiceDetailPage;
