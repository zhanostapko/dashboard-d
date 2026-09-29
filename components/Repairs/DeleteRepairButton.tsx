"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import labelsData from "@/data/labels.json";
import { deleteRepairAction } from "@/app/actions/repairs";

type Props = {
  repairId: number;
};

const DeleteRepairButton = ({ repairId }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRepair = async () => {
    if (!confirm("Удалить ремонт?")) return;

    setIsLoading(true);
    const result = await deleteRepairAction(repairId);

    if (!result.success) {
      setError(result.error ?? "Не удалось удалить ремонт.");
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
