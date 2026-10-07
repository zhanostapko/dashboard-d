"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { closeRepairAction, reopenRepairAction } from "@/app/actions/repairs";
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
  repair: RepairDto;
  canReopen: boolean;
};

export default function RepairStatusSelect({ repair, canReopen }: Props) {
  const router = useRouter();
  const labelsData = useLocaleData();
  const [status, setStatus] = useState<RepairDto["status"]>(repair.status);
  const [loading, setLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<RepairDto["status"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { closed, loading: loadingLabel, open } = labelsData.ru.repairs;

  useEffect(() => {
    setStatus(repair.status);
  }, [repair.status]);

  const handleStatusChange = (nextStatus: RepairDto["status"]) => {
    if (nextStatus === status) return;
    if (nextStatus === "Open" && !canReopen) return;
    setPendingStatus(nextStatus);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;

    setLoading(true);
    setError(null);

    const result =
      pendingStatus === "Closed"
        ? await closeRepairAction(repair.id)
        : await reopenRepairAction(repair.id);

    if (!result.success) {
      setError(
        result.error ??
          (pendingStatus === "Closed"
            ? labelsData.ru.errors.closeRepair
            : labelsData.ru.errors.reopenRepair),
      );
      setLoading(false);
      return;
    }

    setStatus(pendingStatus);
    setLoading(false);
    setPendingStatus(null);
    router.refresh();
  };

  const dialogTitle =
    pendingStatus === "Closed"
      ? labelsData.ru.dialogs.closeRepair
      : labelsData.ru.dialogs.reopenRepair;
  const dialogDescription = (
    <>
      <p>
        {pendingStatus === "Closed"
          ? labelsData.ru.dialogs.closeRepairDescription
          : labelsData.ru.dialogs.reopenRepairDescription}
      </p>
      {pendingStatus === "Open" && repair.invoiceId && (
        <p className="mt-2">
          {labelsData.ru.dialogs.reopenRepairInvoiceWarning.replace(
            "{invoiceId}",
            String(repair.invoiceId),
          )}
        </p>
      )}
    </>
  );

  return (
    <div
      className="flex min-w-[130px] flex-col flex-1 gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <Select
        value={status}
        onValueChange={(value) =>
          handleStatusChange(value as RepairDto["status"])
        }
        disabled={loading || (status === "Closed" && !canReopen)}
      >
        <SelectTrigger
          className="w-full"
          aria-label={labelsData.ru.repairs.status}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Open">{open}</SelectItem>
          <SelectItem value="Closed">{closed}</SelectItem>
        </SelectContent>
      </Select>
      {loading && (
        <span className="text-xs text-muted-foreground">{loadingLabel}</span>
      )}
      <ConfirmActionDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingStatus(null);
            setError(null);
          }
        }}
        title={dialogTitle}
        description={dialogDescription}
        cancelLabel={labelsData.ru.invoices.invoiceForm.invoiceItems.cancelEdit}
        confirmLabel={
          pendingStatus === "Closed"
            ? labelsData.ru.repairs.closeRepairBtn
            : labelsData.ru.common.reopenRepair
        }
        isPending={loading}
        error={error}
        onConfirm={confirmStatusChange}
      />
    </div>
  );
}
