"use client";
import React from "react";
import { Button } from "../ui/button";
import { useLocaleData } from "@/components/General/I18nProvider";
import { InvoiceDto, InvoiceItemDto } from "@/modules/invoices/schema";
import { useNavigationProgress } from "@/components/General/NavigationProgress";

type Props = {
  invoice: InvoiceDto & {
    items: InvoiceItemDto[];
  };
};

const EditInvoiceButton = ({ invoice }: Props) => {
  const { navigate } = useNavigationProgress();
  const data = useLocaleData();
  const editLabel = data.ru.invoices.invoiceForm.editInvoiceButton;

  return (
    <Button
      disabled={invoice.status === "Paid"}
      onClick={() => {
        if (invoice.status === "Paid") return;
        navigate(`/auth/invoices/${invoice.id}/edit`);
      }}
    >
      {editLabel}
    </Button>
  );
};

export default EditInvoiceButton;
