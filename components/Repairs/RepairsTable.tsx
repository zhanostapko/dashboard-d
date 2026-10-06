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
import { useLocaleData } from "@/components/General/I18nProvider";
import TableSearch from "@/components/General/TableSearch";
import { RepairDto } from "@/modules/repairs/schema";
import { deleteRepairAction } from "@/app/actions/repairs";
import { Trash2 } from "lucide-react";
import RepairStatusSelect from "./RepairStatusSelect";
import RepairPaymentSelect from "./RepairPaymentSelect";
import EditRepairButton from "./EditRepairButton";

type Props = {
  repairs: RepairDto[];
  canManagePayment: boolean;
  canReopen: boolean;
};

const RepairsTable = ({ repairs, canManagePayment, canReopen }: Props) => {
  const [repairToDelete, setRepairToDelete] = useState<RepairDto | null>(null);
  const [deletingRepairId, setDeletingRepairId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const labelsData = useLocaleData();

  const {
    nr,
    clientName,
    carPlate,
    date,
    actions,
    addRepairBtn,
    deleteRepairBtn,
    loading,
    status,
    open,
    closed,
  } = labelsData.ru.repairs;
  const { clearSearch, noResults, search } = labelsData.ru.common;
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
  const filteredRepairs = repairs.filter((repair) =>
    [
      repair.id,
      repair.clientName,
      repair.clientPhone,
      repair.carBrand,
      repair.carModel,
      repair.carPlate,
      repair.date,
      repair.status,
      repair.status === "Closed" ? closed : open,
      repair.paymentStatus,
      repair.paymentStatus === "Paid"
        ? labelsData.ru.invoices.paid
        : labelsData.ru.invoices.unpaid,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedSearch),
  );

  const deleteRepair = async () => {
    if (!repairToDelete) return;

    try {
      const repairId = repairToDelete.id;
      setDeletingRepairId(repairId);
      const result = await deleteRepairAction(repairId);

      if (!result.success) {
        throw new Error(result.error ?? labelsData.ru.errors.deleteRepair);
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
            <DialogTitle>{labelsData.ru.dialogs.deleteRepair}</DialogTitle>
            <DialogDescription>
              {labelsData.ru.dialogs.deleteRepairDescription.replace(
                "{client}",
                repairToDelete?.clientName || labelsData.ru.clients.name,
              )}
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {labelsData.ru.invoices.invoiceForm.invoiceItems.cancelEdit}
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingRepairId === repairToDelete?.id}
              onClick={deleteRepair}
            >
              {deletingRepairId === repairToDelete?.id
                ? loading
                : deleteRepairBtn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button onClick={() => router.push("/auth/repairs/new")} className="mb-4">
        + {addRepairBtn}
      </Button>
      {deleteError && !repairToDelete && (
        <p className="mb-4 text-sm text-red-500">{deleteError}</p>
      )}
      <TableSearch
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={search}
        clearLabel={clearSearch}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{nr}</TableHead>
            <TableHead>{clientName}</TableHead>
            <TableHead>{carPlate}</TableHead>
            <TableHead>{date}</TableHead>
            <TableHead>{status}</TableHead>
            <TableHead className="w-[96px] text-right">{actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRepairs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {noResults}
              </TableCell>
            </TableRow>
          ) : (
            filteredRepairs.map((repair, index) => (
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
                <TableCell>
                  <div className="inline-flex w-full gap-2">
                    <RepairStatusSelect
                      repair={repair}
                      canReopen={canReopen}
                    />
                    <RepairPaymentSelect
                      repair={repair}
                      canManage={canManagePayment}
                    />
                  </div>
                </TableCell>
                <TableCell className="w-[96px]">
                  <div className="flex justify-end gap-1">
                    {repair.status === "Open" && (
                      <EditRepairButton repairId={repair.id} iconOnly />
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title={deleteRepairBtn}
                      aria-label={`${deleteRepairBtn}: ${repair.clientName}`}
                      disabled={
                        repair.status === "Closed" ||
                        repair.invoiceId !== null ||
                        deletingRepairId === repair.id
                      }
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
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default RepairsTable;
