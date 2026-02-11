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
import ModalWrapper from "@/components/General/ModalWrapper";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import labelsData from "@/data/labels.json";
import CreateRepairForm from "./CreateRepairForm/CreateRepairForm";
import { RepairDto } from "@/modules/repairs/schema";

type Props = {
  repairs: RepairDto[];
};

const RepairsTable = ({ repairs }: Props) => {
  const [selectedRepair, setSelectedRepair] = useState<RepairDto | null>(null);
  const [deletingRepairId, setDeletingRepairId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {
    nr,
    clientName,
    carPlate,
    date,
    actions,
    addRepairBtn,
    editRepairBtn,
    deleteRepairBtn,
  } = labelsData.ru.repairs;

  const deleteRepair = async (repairId: number) => {
    try {
      setDeletingRepairId(repairId);
      const res = await fetch(`/api/repairs/${repairId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete repair");
      }
      router.refresh();
    } catch (err) {
      console.log(err);
      setDeletingRepairId(null);
    }
  };

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalContent={
          <CreateRepairForm
            repair={selectedRepair ?? undefined}
            editMode={!!selectedRepair}
            onClose={() => setIsOpen(false)}
          />
        }
      ></ModalWrapper>
      <Button
        onClick={() => {
          setSelectedRepair(null);
          setIsOpen(true);
        }}
        className="mb-4"
      >
        + {addRepairBtn}
      </Button>
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
            <TableRow key={repair.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{repair.clientName}</TableCell>
              <TableCell>{repair.carPlate}</TableCell>
              <TableCell>
                {new Date(repair.date).toLocaleDateString("en-US")}
              </TableCell>
              <TableCell className="flex gap-4 justify-end">
                <Button
                  onClick={() => {
                    setSelectedRepair(repair);
                    setIsOpen(true);
                  }}
                >
                  {editRepairBtn}
                </Button>
                <Button
                  disabled={deletingRepairId === repair.id}
                  onClick={() => deleteRepair(repair.id)}
                >
                  {deletingRepairId === repair.id
                    ? "Loading"
                    : deleteRepairBtn}
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
