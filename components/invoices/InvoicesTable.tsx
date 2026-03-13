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
import labelsData from "@/data/labels.json";
import { InvoiceDto } from "@/modules/invoices/schema";

type Props = {
  data: InvoiceDto[];
};

const InvoicesTable = ({ data }: Props) => {
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<number | null>(null);
  const router = useRouter();

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
  const statusChangeHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
    invoiceId: number
  ) => {
    event?.stopPropagation();
    setLoadingInvoiceId(invoiceId);
    const res = await fetch(`/api/invoices`, {
      method: "PUT",
      body: JSON.stringify({ invoiceId }),
    });

    if (!res.ok) {
      throw new Error("Failed to delete invoice");
    }
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
          {data?.length === 0 && (
            <TableRow className="text-center">
              <TableCell colSpan={8}>{noInvoicesFound}</TableCell>
            </TableRow>
          )}
          {data?.map((invoice, index) => (
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
