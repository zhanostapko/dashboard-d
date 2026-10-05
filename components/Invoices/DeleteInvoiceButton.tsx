"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { InvoiceWithDetails } from "@/types/invoice";
import { useLocaleData } from "@/components/General/I18nProvider";
import { deleteInvoiceAction } from "@/app/actions/invoices";

type Props = {
  invoice: InvoiceWithDetails;
};

const DeleteInvoiceButton = ({ invoice }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const data = useLocaleData();
  const deleteLabel = data.ru.invoices.invoiceForm.deleteInvoiceButton;
  const deletingLabel = data.ru.invoices.deleting;

  const deleteInvoice = async (invoiceId: number) => {
    setIsLoading(true);
    const result = await deleteInvoiceAction(invoiceId);

    if (!result.success) {
      setError(result.error ?? data.ru.errors.deleteInvoice);
      setIsLoading(false);
      return;
    }
    setError(null);
    setIsLoading(false);
    router.push("/auth/invoices");
  };
  return (
    <div className="space-y-2">
      <Button
        disabled={isLoading || invoice.status === "Paid"}
        onClick={() => {
          deleteInvoice(invoice.id);
        }}
      >
        {isLoading ? deletingLabel : `${deleteLabel}`}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DeleteInvoiceButton;
