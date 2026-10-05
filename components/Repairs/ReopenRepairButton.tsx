"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocaleData } from "@/components/General/I18nProvider";
import { reopenRepairAction } from "@/app/actions/repairs";

type Props = { repairId: number };

export default function ReopenRepairButton({ repairId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const labelsData = useLocaleData();

  const handleReopen = async () => {
    if (
      !confirm(
        `${labelsData.ru.dialogs.reopenRepair} ${labelsData.ru.dialogs.reopenRepairDescription}`
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    const result = await reopenRepairAction(repairId);

    if (!result.success) {
      setError(result.error ?? labelsData.ru.errors.reopenRepair);
      setLoading(false);
      return;
    }

    router.refresh();
  };

  return (
    <div className="space-y-2">
      <Button disabled={loading} onClick={handleReopen} variant="outline">
        {loading ? labelsData.ru.repairs.loading : labelsData.ru.common.reopenRepair}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
