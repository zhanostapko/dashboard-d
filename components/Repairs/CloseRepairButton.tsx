"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocaleData } from "@/components/General/I18nProvider";
import { closeRepairAction } from "@/app/actions/repairs";
import ConfirmActionDialog from "@/components/General/ConfirmActionDialog";

type Props = {
  repairId: number;
  hasZeroPriceItem: boolean;
};

export default function CloseRepairButton({ repairId, hasZeroPriceItem }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [zeroPriceConfirmOpen, setZeroPriceConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const labelsData = useLocaleData();

  const handleClose = async () => {
    setLoading(true);
    setError(null);
    const result = await closeRepairAction(repairId);
    if (!result.success) {
      setError(result.error ?? labelsData.ru.errors.closeRepair);
      setLoading(false);
      return;
    }

    setConfirmOpen(false);
    router.refresh();
  };

  const requestClose = () => {
    setError(null);
    if (hasZeroPriceItem) {
      setZeroPriceConfirmOpen(true);
      return;
    }

    setConfirmOpen(true);
  };

  const confirmZeroPriceItems = () => {
    setZeroPriceConfirmOpen(false);
    setConfirmOpen(true);
  };

  return (
    <>
      <Button disabled={loading} onClick={requestClose} variant="outline">
        {loading ? labelsData.ru.repairs.loading : labelsData.ru.repairs.closeRepairBtn}
      </Button>
      <ConfirmActionDialog
        open={zeroPriceConfirmOpen}
        onOpenChange={setZeroPriceConfirmOpen}
        title={labelsData.ru.dialogs.zeroPriceRepair}
        description={labelsData.ru.dialogs.zeroPriceRepairDescription}
        cancelLabel={labelsData.ru.invoices.invoiceForm.invoiceItems.cancelEdit}
        confirmLabel={labelsData.ru.dialogs.keepZeroPriceItems}
        onConfirm={confirmZeroPriceItems}
      />
      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setError(null);
        }}
        title={labelsData.ru.dialogs.closeRepair}
        description={labelsData.ru.dialogs.closeRepairDescription}
        cancelLabel={labelsData.ru.invoices.invoiceForm.invoiceItems.cancelEdit}
        confirmLabel={labelsData.ru.repairs.closeRepairBtn}
        isPending={loading}
        error={error}
        onConfirm={handleClose}
      />
    </>
  );
}
