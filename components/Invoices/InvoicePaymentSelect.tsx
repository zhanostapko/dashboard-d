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

type Props = {
  invoice: Pick<InvoiceDto, "id" | "status">;
};

export default function InvoicePaymentSelect({ invoice }: Props) {
  const router = useRouter();
  const labels = useLocaleData().ru;
  const [status, setStatus] = useState(invoice.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus(invoice.status);
  }, [invoice.status]);

  const handleStatusChange = async (nextStatus: InvoiceDto["status"]) => {
    if (nextStatus === status || nextStatus !== "Paid") return;

    if (
      !window.confirm(
        `${labels.dialogs.payInvoice} ${labels.dialogs.payInvoiceDescription}`
      )
    ) {
      return;
    }

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
        disabled={loading || status === "Paid"}
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
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
