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
import InvoicePaymentSelect from "./InvoicePaymentSelect";

type Props = {
  data: InvoiceDto[];
};

const InvoicesTable = ({ data }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const labelsData = useLocaleData();

  const {
    addInvoiceBtn,
    carPlate,
    clientName,
    date,
    invoiceNumber,
    status,
    nr,
    total,
    noInvoicesFound,
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
  return (
    <>
      <Button
        onClick={() => router.push("/auth/invoices/new")}
        className="mb-4"
      >
        + {addInvoiceBtn}
      </Button>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.length === 0 && (
            <TableRow className="text-center">
              <TableCell colSpan={7}>
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
              <TableCell>
                <InvoicePaymentSelect invoice={invoice} />
              </TableCell>
              <TableCell>{invoice.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default InvoicesTable;
