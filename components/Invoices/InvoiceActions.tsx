"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteInvoiceAction } from "@/app/actions/invoices";
import { useLocaleData } from "@/components/General/I18nProvider";
import { Button } from "@/components/ui/button";
import { InvoiceDto } from "@/modules/invoices/schema";
import ConfirmActionDialog from "@/components/General/ConfirmActionDialog";
import { useNavigationProgress } from "@/components/General/NavigationProgress";

type Props = {
  invoice: InvoiceDto;
};

export default function InvoiceActions({ invoice }: Props) {
  const router = useRouter();
  const { navigate } = useNavigationProgress();
  const labels = useLocaleData().ru;
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (invoice.status === "Paid") return null;

  const deleteInvoice = async () => {
    setIsDeleting(true);
    setError(null);
    const result = await deleteInvoiceAction(invoice.id);

    if (!result.success) {
      setError(result.error ?? labels.errors.deleteInvoice);
      setIsDeleting(false);
      return;
    }

    setDeleteOpen(false);
    router.refresh();
  };

  return (
    <div
      className="flex justify-end gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title={labels.invoices.invoiceForm.editInvoiceButton}
        aria-label={`${labels.invoices.invoiceForm.editInvoiceButton}: ${invoice.number}`}
        onClick={() => navigate(`/auth/invoices/${invoice.id}/edit`)}
      >
        <Pencil className="size-4" />
        <span className="sr-only">
          {labels.invoices.invoiceForm.editInvoiceButton}
        </span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title={labels.invoices.invoiceForm.deleteInvoiceButton}
        aria-label={`${labels.invoices.invoiceForm.deleteInvoiceButton}: ${invoice.number}`}
        disabled={isDeleting}
        onClick={() => setDeleteOpen(true)}
      >
        {isDeleting ? (
          <span className="text-xs">{labels.invoices.deleting}</span>
        ) : (
          <Trash2 className="size-4 text-destructive" />
        )}
      </Button>
      <ConfirmActionDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setError(null);
        }}
        title={labels.dialogs.deleteInvoice}
        description={labels.invoices.invoiceForm.deleteInvoiceButton}
        cancelLabel={labels.invoices.invoiceForm.invoiceItems.cancelEdit}
        confirmLabel={labels.invoices.invoiceForm.deleteInvoiceButton}
        isPending={isDeleting}
        error={error}
        destructive
        onConfirm={deleteInvoice}
      />
    </div>
  );
}
