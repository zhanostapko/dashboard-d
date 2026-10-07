"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { markRepairPaidAction } from "@/app/actions/repairs";
import { useLocaleData } from "@/components/General/I18nProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RepairDto } from "@/modules/repairs/schema";
import ConfirmActionDialog from "@/components/General/ConfirmActionDialog";

type Props = {
  repair: Pick<RepairDto, "id" | "paymentStatus" | "invoiceId">;
  canManage?: boolean;
};

export default function RepairPaymentSelect({
  repair,
  canManage = true,
}: Props) {
  const router = useRouter();
  const labels = useLocaleData().ru;
  const [paymentStatus, setPaymentStatus] = useState(repair.paymentStatus);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPaymentStatus(repair.paymentStatus);
  }, [repair.paymentStatus]);

  const handlePaymentChange = (
    nextStatus: RepairDto["paymentStatus"],
  ) => {
    if (nextStatus === paymentStatus || nextStatus !== "Paid") return;
    setConfirmOpen(true);
  };

  const markPaid = async () => {
    setLoading(true);
    setError(null);
    const result = await markRepairPaidAction(repair.id);

    if (!result.success) {
      setError(result.error ?? labels.errors.database);
      setLoading(false);
      return;
    }

    setPaymentStatus("Paid");
    setLoading(false);
    setConfirmOpen(false);
    router.refresh();
  };

  return (
    <div
      className="flex min-w-[130px] flex-col flex-1 gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <Select
        value={paymentStatus}
        onValueChange={(value) =>
          handlePaymentChange(value as RepairDto["paymentStatus"])
        }
        disabled={
          !canManage ||
          repair.invoiceId !== null ||
          loading ||
          paymentStatus === "Paid"
        }
      >
        <SelectTrigger className="w-full" aria-label={labels.invoices.status}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Unpaid">{labels.invoices.unpaid}</SelectItem>
          <SelectItem value="Paid">{labels.invoices.paid}</SelectItem>
        </SelectContent>
      </Select>
      {loading && (
        <span className="text-xs text-muted-foreground">
          {labels.repairs.loading}
        </span>
      )}
      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setError(null);
        }}
        title={labels.dialogs.payRepair}
        description={labels.dialogs.payRepairDescription}
        cancelLabel={labels.invoices.invoiceForm.invoiceItems.cancelEdit}
        confirmLabel={labels.invoices.paidBtn}
        isPending={loading}
        error={error}
        onConfirm={markPaid}
      />
    </div>
  );
}
