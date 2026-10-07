"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocaleData } from "@/components/General/I18nProvider";
import { reopenRepairAction } from "@/app/actions/repairs";
import ConfirmActionDialog from "@/components/General/ConfirmActionDialog";

type Props = {
  repairId: number;
  invoiceId?: number | null;
};

export default function ReopenRepairButton({ repairId, invoiceId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const labelsData = useLocaleData();

  const reopenDescription = (
    <>
      <p>{labelsData.ru.dialogs.reopenRepairDescription}</p>
      {invoiceId && (
        <p className="mt-2">
          {labelsData.ru.dialogs.reopenRepairInvoiceWarning.replace(
            "{invoiceId}",
            String(invoiceId),
          )}
        </p>
      )}
    </>
  );

  const handleReopen = async () => {
    setLoading(true);
    setError(null);
    const result = await reopenRepairAction(repairId);

    if (!result.success) {
      setError(result.error ?? labelsData.ru.errors.reopenRepair);
      setLoading(false);
      return;
    }

    setConfirmOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button disabled={loading} onClick={() => setConfirmOpen(true)} variant="outline">
        {loading ? labelsData.ru.repairs.loading : labelsData.ru.common.reopenRepair}
      </Button>
      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setError(null);
        }}
        title={labelsData.ru.dialogs.reopenRepair}
        description={reopenDescription}
        cancelLabel={labelsData.ru.invoices.invoiceForm.invoiceItems.cancelEdit}
        confirmLabel={labelsData.ru.common.reopenRepair}
        isPending={loading}
        error={error}
        onConfirm={handleReopen}
      />
    </>
  );
}
