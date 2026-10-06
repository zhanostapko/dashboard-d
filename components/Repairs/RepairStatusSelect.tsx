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

type Props = {
  repair: RepairDto;
};

export default function RepairStatusSelect({ repair }: Props) {
  const router = useRouter();
  const labelsData = useLocaleData();
  const [status, setStatus] = useState<RepairDto["status"]>(repair.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { closed, loading: loadingLabel, open } = labelsData.ru.repairs;

  useEffect(() => {
    setStatus(repair.status);
  }, [repair.status]);

  const handleStatusChange = async (nextStatus: RepairDto["status"]) => {
    if (nextStatus === status) return;

    const confirmed = window.confirm(
      nextStatus === "Closed"
        ? `${labelsData.ru.dialogs.closeRepair} ${labelsData.ru.dialogs.closeRepairDescription}`
        : `${labelsData.ru.dialogs.reopenRepair} ${labelsData.ru.dialogs.reopenRepairDescription}`,
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);

    const result =
      nextStatus === "Closed"
        ? await closeRepairAction(repair.id)
        : await reopenRepairAction(repair.id);

    if (!result.success) {
      setError(
        result.error ??
          (nextStatus === "Closed"
            ? labelsData.ru.errors.closeRepair
            : labelsData.ru.errors.reopenRepair),
      );
      setLoading(false);
      return;
    }

    setStatus(nextStatus);
    setLoading(false);
    router.refresh();
  };

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
        disabled={loading}
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
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
