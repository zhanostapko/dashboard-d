"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { markInvoicePaidAction } from "@/app/actions/invoices";
import { useLocaleData } from "@/components/General/I18nProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceDto } from "@/modules/invoices/schema";
import ConfirmActionDialog from "@/components/General/ConfirmActionDialog";

type Props = {
  invoice: Pick<InvoiceDto, "id" | "status">;
  canManage: boolean;
};

export default function InvoicePaymentSelect({ invoice, canManage }: Props) {
  const router = useRouter();
  const labels = useLocaleData().ru;
  const [status, setStatus] = useState(invoice.status);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus(invoice.status);
  }, [invoice.status]);

  const handleStatusChange = (nextStatus: InvoiceDto["status"]) => {
    if (nextStatus === status || nextStatus !== "Paid") return;
    setConfirmOpen(true);
  };

  const markPaid = async () => {
    setLoading(true);
    setError(null);
    const result = await markInvoicePaidAction(invoice.id);

    if (!result.success) {
      setError(result.error ?? labels.errors.updateInvoice);
      setLoading(false);
      return;
    }

    setStatus("Paid");
    setLoading(false);
    setConfirmOpen(false);
    router.refresh();
  };

  return (
    <div
      className="flex min-w-[130px] flex-col gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <Select
        value={status}
        onValueChange={(value) =>
          handleStatusChange(value as InvoiceDto["status"])
        }
        disabled={!canManage || loading || status === "Paid"}
      >
        <SelectTrigger className="w-full" aria-label={labels.invoices.status}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Unpaid">{labels.invoices.unpaid}</SelectItem>
          <SelectItem value="Paid">{labels.invoices.paid}</SelectItem>
        </SelectContent>
      </Select>
      {loading && <span className="text-xs text-muted-foreground">{labels.invoices.sending}</span>}
      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setError(null);
        }}
        title={labels.dialogs.payInvoice}
        description={labels.dialogs.payInvoiceDescription}
        cancelLabel={labels.invoices.invoiceForm.invoiceItems.cancelEdit}
        confirmLabel={labels.invoices.paidBtn}
        isPending={loading}
        error={error}
        onConfirm={markPaid}
      />
    </div>
  );
}
