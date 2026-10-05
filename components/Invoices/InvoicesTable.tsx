"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLocaleData } from "@/components/General/I18nProvider";
import TableSearch from "@/components/General/TableSearch";
import { InvoiceDto } from "@/modules/invoices/schema";
import { markInvoicePaidAction } from "@/app/actions/invoices";

type Props = {
  data: InvoiceDto[];
};

const InvoicesTable = ({ data }: Props) => {
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const labelsData = useLocaleData();

  const {
    addInvoiceBtn,
    actions,
    carPlate,
    clientName,
    date,
    invoiceNumber,
    status,
    nr,
    total,
    unpaid,
    paid,
    paidBtn,
    noInvoicesFound,
    sending,
  } = labelsData.ru.invoices;
  const { clearSearch, noResults, search } = labelsData.ru.common;
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
  const filteredInvoices = (data ?? []).filter((invoice) =>
    [
      invoice.number,
      invoice.clientName,
      invoice.carPlate,
      invoice.date,
      invoice.status,
      invoice.total,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedSearch)
  );
  const statusChangeHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
    invoiceId: number
  ) => {
    event?.stopPropagation();
    setLoadingInvoiceId(invoiceId);
    const result = await markInvoicePaidAction(invoiceId);

    if (!result.success) {
      setError(result.error ?? labelsData.ru.errors.updateInvoice);
      setLoadingInvoiceId(null);
      return;
    }
    setError(null);
    setLoadingInvoiceId(null);
    router.refresh();
  };

  return (
    <>
      <Button
        onClick={() => router.push("/auth/invoices/new")}
        className="mb-4"
      >
        + {addInvoiceBtn}
      </Button>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <TableSearch
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={search}
        clearLabel={clearSearch}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">{nr}</TableHead>
            <TableHead>{invoiceNumber} #</TableHead>
            <TableHead>{clientName}</TableHead>
            <TableHead>{carPlate}</TableHead>
            <TableHead>{date}</TableHead>
            <TableHead>{status}</TableHead>
            <TableHead>{total}</TableHead>
            <TableHead className="text-right">{actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.length === 0 && (
            <TableRow className="text-center">
              <TableCell colSpan={8}>
                {searchTerm ? noResults : noInvoicesFound}
              </TableCell>
            </TableRow>
          )}
          {filteredInvoices.map((invoice, index) => (
            <TableRow
              className="cursor-pointer"
              key={invoice.id}
              onClick={() => router.push(`/auth/invoices/${invoice.id}`)}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{invoice.number}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>{invoice.carPlate}</TableCell>
              <TableCell>
                {
                  new Date(invoice.date).toLocaleDateString(
                    "en-US"
                  ) /* or any format */
                }
              </TableCell>
              <TableCell>{invoice.status === "Paid" ? paid : unpaid}</TableCell>
              <TableCell>{invoice.total}</TableCell>
              <TableCell className="flex gap-4 justify-end">
                <Button
                  disabled={
                    invoice.status === "Paid" || loadingInvoiceId === invoice.id
                  }
                  onClick={(event) => statusChangeHandler(event, invoice.id)}
                  variant="outline"
                >
                  {loadingInvoiceId === invoice.id
                    ? sending
                    : `${paidBtn}`}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default InvoicesTable;
