"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocaleData } from "@/components/General/I18nProvider";
import { markRepairPaidAction } from "@/app/actions/repairs";

export default function RepairPaymentButton({ repairId }: { repairId: number }) {
  const router = useRouter();
  const labels = useLocaleData().ru;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markPaid = async () => {
    if (
      !window.confirm(
        `${labels.dialogs.payRepair} ${labels.dialogs.payRepairDescription}`
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    const result = await markRepairPaidAction(repairId);
    if (!result.success) {
      setError(result.error ?? labels.errors.database);
      setLoading(false);
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" disabled={loading} onClick={markPaid}>
        {loading ? labels.repairs.loading : labels.invoices.paidBtn}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
