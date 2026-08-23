"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import labelsData from "@/data/labels.json";

type Props = {
  repairId: number;
};

const EditRepairButton = ({ repairId }: Props) => {
  const router = useRouter();

  return (
    <Button onClick={() => router.push(`/auth/repairs/${repairId}/edit`)}>
      {labelsData.ru.repairs.editRepairBtn}
    </Button>
  );
};

export default EditRepairButton;
