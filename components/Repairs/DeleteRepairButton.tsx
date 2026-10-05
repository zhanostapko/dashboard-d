"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocaleData } from "@/components/General/I18nProvider";
import { deleteRepairAction } from "@/app/actions/repairs";

type Props = {
  repairId: number;
};

const DeleteRepairButton = ({ repairId }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const labelsData = useLocaleData();

  const deleteRepair = async () => {
    if (!confirm(labelsData.ru.dialogs.deleteRepair)) return;

    setIsLoading(true);
    const result = await deleteRepairAction(repairId);

    if (!result.success) {
      setError(result.error ?? labelsData.ru.errors.deleteRepair);
      setIsLoading(false);
      return;
    }

    router.push("/auth/repairs");
    router.refresh();
  };

  return (
    <div className="space-y-2">
      <Button disabled={isLoading} onClick={deleteRepair} variant="destructive">
        {isLoading
          ? labelsData.ru.repairs.deleting
          : labelsData.ru.repairs.deleteRepairBtn}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DeleteRepairButton;
