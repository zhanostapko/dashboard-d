"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useLocaleData } from "@/components/General/I18nProvider";
import { InvoiceDto, InvoiceItemDto } from "@/modules/invoices/schema";

type Props = {
  invoice: InvoiceDto & {
    items: InvoiceItemDto[];
  };
};

const EditInvoiceButton = ({ invoice }: Props) => {
  const router = useRouter();
  const data = useLocaleData();
  const editLabel = data.ru.invoices.invoiceForm.editInvoiceButton;

  return (
    <Button
      disabled={invoice.status === "Paid"}
      onClick={() => {
        if (invoice.status === "Paid") return;
        router.push(`/auth/invoices/${invoice.id}/edit`);
      }}
    >
      {editLabel}
    </Button>
  );
};

export default EditInvoiceButton;
