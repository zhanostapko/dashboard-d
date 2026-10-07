"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { InvoiceWithDetails } from "@/types/invoice";
import { useLocaleData } from "@/components/General/I18nProvider";
import { deleteInvoiceAction } from "@/app/actions/invoices";
import ConfirmActionDialog from "@/components/General/ConfirmActionDialog";

type Props = {
  invoice: InvoiceWithDetails;
};

const DeleteInvoiceButton = ({ invoice }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
    router.push("/auth/invoices");
  };
  return (
    <>
      <Button
        disabled={isLoading || invoice.status === "Paid"}
        variant="destructive"
        onClick={() => setIsOpen(true)}
      >
        {isLoading ? deletingLabel : `${deleteLabel}`}
      </Button>
      <ConfirmActionDialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setError(null);
        }}
        title={data.ru.dialogs.deleteInvoice}
        description={deleteLabel}
        cancelLabel={data.ru.invoices.invoiceForm.invoiceItems.cancelEdit}
        confirmLabel={deleteLabel}
        isPending={isLoading}
        error={error}
        destructive
        onConfirm={() => deleteInvoice(invoice.id)}
      />
    </>
  );
};

export default DeleteInvoiceButton;
