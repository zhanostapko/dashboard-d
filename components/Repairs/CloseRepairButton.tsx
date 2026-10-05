"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import labelsData from "@/data/labels.json";
import { closeRepairAction } from "@/app/actions/repairs";

type Props = { repairId: number };

export default function CloseRepairButton({ repairId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = async () => {
    if (!confirm("Закрыть ремонт? После закрытия его нельзя будет изменить.")) {
      return;
    }

    setLoading(true);
    setError(null);
    const result = await closeRepairAction(repairId);
    if (!result.success) {
      setError(result.error ?? "Не удалось закрыть ремонт.");
      setLoading(false);
      return;
    }

    router.refresh();
  };

  return (
    <div className="space-y-2">
      <Button disabled={loading} onClick={handleClose} variant="outline">
        {loading ? labelsData.ru.repairs.loading : labelsData.ru.repairs.closeRepairBtn}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
