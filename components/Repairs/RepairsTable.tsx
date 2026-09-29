"use client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import labelsData from "@/data/labels.json";
import { RepairDto } from "@/modules/repairs/schema";
import { deleteRepairAction } from "@/app/actions/repairs";
import { Trash2 } from "lucide-react";

type Props = {
  repairs: RepairDto[];
};

const RepairsTable = ({ repairs }: Props) => {
  const [repairToDelete, setRepairToDelete] = useState<RepairDto | null>(null);
  const [deletingRepairId, setDeletingRepairId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  const {
    nr,
    clientName,
    carPlate,
    date,
    actions,
    addRepairBtn,
    deleteRepairBtn,
    loading,
  } = labelsData.ru.repairs;

  const deleteRepair = async () => {
    if (!repairToDelete) return;

    try {
      const repairId = repairToDelete.id;
      setDeletingRepairId(repairId);
      const result = await deleteRepairAction(repairId);

      if (!result.success) {
        throw new Error(result.error ?? "Не удалось удалить ремонт.");
      }

      setDeleteError(null);
      setRepairToDelete(null);
      setDeletingRepairId(null);
      router.refresh();
    } catch (err) {
      setDeleteError((err as Error).message);
      setDeletingRepairId(null);
    }
  };

  return (
    <>
      <Dialog
        open={!!repairToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setRepairToDelete(null);
            setDeleteError(null);
            setDeletingRepairId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить ремонт?</DialogTitle>
            <DialogDescription>
              Ремонт для {repairToDelete?.clientName || "клиента"} будет удален
              вместе с позициями. Это действие нельзя отменить из интерфейса.
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingRepairId === repairToDelete?.id}
              onClick={deleteRepair}
            >
              {deletingRepairId === repairToDelete?.id ? loading : deleteRepairBtn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button
        onClick={() => router.push("/auth/repairs/new")}
        className="mb-4"
      >
        + {addRepairBtn}
      </Button>
      {deleteError && !repairToDelete && (
        <p className="mb-4 text-sm text-red-500">{deleteError}</p>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{nr}</TableHead>
            <TableHead>{clientName}</TableHead>
            <TableHead>{carPlate}</TableHead>
            <TableHead>{date}</TableHead>
            <TableHead className="text-right">{actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repairs.map((repair, index) => (
            <TableRow
              key={repair.id}
              className="cursor-pointer"
              onClick={() => router.push(`/auth/repairs/${repair.id}`)}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{repair.clientName}</TableCell>
              <TableCell>{repair.carPlate}</TableCell>
              <TableCell>
                {new Date(repair.date).toLocaleDateString("en-US")}
              </TableCell>
              <TableCell className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title={deleteRepairBtn}
                  aria-label={`${deleteRepairBtn}: ${repair.clientName}`}
                  disabled={deletingRepairId === repair.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    setRepairToDelete(repair);
                  }}
                >
                  {deletingRepairId === repair.id ? (
                    <span className="text-xs">{loading}</span>
                  ) : (
                    <Trash2 className="size-4 text-destructive" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default RepairsTable;
