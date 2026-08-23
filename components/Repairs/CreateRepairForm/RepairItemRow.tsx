"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import data from "@/data/labels.json";
import { RepairItemDto } from "@/modules/repairs/schema";

type Props = {
  item: RepairItemDto;
  onRemove: (id: number) => void;
};

export default function RepairItemRow({ item, onRemove }: Props) {
  const { work, materials } = data.ru.repairs.repairForm.repairItems;
  const typeLabel = item.unit === "materials" ? materials : work;

  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>{typeLabel}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{item.price?.toFixed(2)}</TableCell>
      <TableCell>
        <button
          type="button"
          className="text-red-500 hover:text-red-700"
          onClick={() => onRemove?.(item.id)}
        >
          ✕
        </button>
      </TableCell>
    </TableRow>
  );
}
