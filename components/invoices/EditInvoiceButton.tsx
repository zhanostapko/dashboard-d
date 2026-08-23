"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import data from "@/data/labels.json";
import { InvoiceDto, InvoiceItemDto } from "@/modules/invoices/schema";

const editLabel = data.ru.invoices.invoiceForm.editInvoiceButton;

type Props = {
  invoice: InvoiceDto & {
    items: InvoiceItemDto[];
  };
};

const EditInvoiceButton = ({ invoice }: Props) => {
  const router = useRouter();

  return (
    <Button
      disabled={invoice.status === "Paid"}
      onClick={() => {
        if (invoice.status === "Paid") return;
        router.push(`/auth/invoices/${invoice.id}/edit`);
      }}
      className="mb-4"
    >
      {editLabel}
    </Button>
  );
};

export default EditInvoiceButton;
