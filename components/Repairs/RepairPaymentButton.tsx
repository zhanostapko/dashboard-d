"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocaleData } from "@/components/General/I18nProvider";
import { markRepairPaidAction } from "@/app/actions/repairs";
import ConfirmActionDialog from "@/components/General/ConfirmActionDialog";

export default function RepairPaymentButton({ repairId }: { repairId: number }) {
  const router = useRouter();
  const labels = useLocaleData().ru;
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markPaid = async () => {
    setLoading(true);
    setError(null);
    const result = await markRepairPaidAction(repairId);
    if (!result.success) {
      setError(result.error ?? labels.errors.database);
      setLoading(false);
      return;
    }
    setConfirmOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button type="button" variant="outline" disabled={loading} onClick={() => setConfirmOpen(true)}>
        {loading ? labels.repairs.loading : labels.invoices.paidBtn}
      </Button>
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
    </>
  );
}
