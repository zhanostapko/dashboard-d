"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocaleData } from "@/components/General/I18nProvider";

type Props = {
  repairId: number;
};

const EditRepairButton = ({ repairId }: Props) => {
  const router = useRouter();
  const labelsData = useLocaleData();

  return (
    <Button onClick={() => router.push(`/auth/repairs/${repairId}/edit`)}>
      {labelsData.ru.repairs.editRepairBtn}
    </Button>
  );
};

export default EditRepairButton;
