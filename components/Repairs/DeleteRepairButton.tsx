"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocaleData } from "@/components/General/I18nProvider";
import { deleteRepairAction } from "@/app/actions/repairs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  repairId: number;
};

const DeleteRepairButton = ({ repairId }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const labelsData = useLocaleData();

  const deleteRepair = async () => {
    setIsLoading(true);
    setError(null);
    const result = await deleteRepairAction(repairId);

    if (!result.success) {
      setError(result.error ?? labelsData.ru.errors.deleteRepair);
      setIsLoading(false);
      return;
    }

    setIsOpen(false);
    router.push("/auth/repairs");
    router.refresh();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setError(null);
      }}
    >
      <Button onClick={() => setIsOpen(true)} variant="destructive">
        {labelsData.ru.repairs.deleteRepairBtn}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labelsData.ru.dialogs.deleteRepair}</DialogTitle>
          <DialogDescription>
            {labelsData.ru.dialogs.deleteRepairDescription}
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              {labelsData.ru.invoices.invoiceForm.invoiceItems.cancelEdit}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            onClick={deleteRepair}
          >
            {isLoading
              ? labelsData.ru.repairs.deleting
              : labelsData.ru.repairs.deleteRepairBtn}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRepairButton;
