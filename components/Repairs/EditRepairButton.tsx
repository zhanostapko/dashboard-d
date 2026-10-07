"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocaleData } from "@/components/General/I18nProvider";
import { useNavigationProgress } from "@/components/General/NavigationProgress";

type Props = {
  repairId: number;
  iconOnly?: boolean;
};

const EditRepairButton = ({ repairId, iconOnly = false }: Props) => {
  const { navigate } = useNavigationProgress();
  const labelsData = useLocaleData();

  return (
    <Button
      type="button"
      variant={iconOnly ? "ghost" : "default"}
      size={iconOnly ? "icon" : "default"}
      title={iconOnly ? labelsData.ru.repairs.editRepairBtn : undefined}
      aria-label={labelsData.ru.repairs.editRepairBtn}
      onClick={(event) => {
        event.stopPropagation();
        navigate(`/auth/repairs/${repairId}/edit`);
      }}
    >
      {iconOnly ? (
        <>
          <Pencil className="size-4" />
          <span className="sr-only">{labelsData.ru.repairs.editRepairBtn}</span>
        </>
      ) : (
        labelsData.ru.repairs.editRepairBtn
      )}
    </Button>
  );
};

export default EditRepairButton;
