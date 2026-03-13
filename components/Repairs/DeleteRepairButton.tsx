"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import labelsData from "@/data/labels.json";

type Props = {
  repairId: number;
};

const DeleteRepairButton = ({ repairId }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const deleteRepair = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/repairs/${repairId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete repair");
    }

    router.push("/auth/repairs");
    router.refresh();
  };

  return (
    <Button disabled={isLoading} onClick={deleteRepair}>
      {isLoading ? labelsData.ru.repairs.deleting : labelsData.ru.repairs.deleteRepairBtn}
    </Button>
  );
};

export default DeleteRepairButton;
