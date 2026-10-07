"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { useLocaleData } from "@/components/General/I18nProvider";
import { RepairItemDto } from "@/modules/repairs/schema";

type Props = {
  editLabel: string;
  item: RepairItemDto;
  onEdit: (item: RepairItemDto) => void;
  onRemove: (id: number) => void;
};

export default function RepairItemRow({
  editLabel,
  item,
  onEdit,
  onRemove,
}: Props) {
  const { work, materials } = useLocaleData().ru.repairs.repairForm.repairItems;
  const typeLabel = item.unit === "materials" ? materials : work;

  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>{typeLabel}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{item.price?.toFixed(2)}</TableCell>
      <TableCell>{(item.quantity * item.price).toFixed(2)}</TableCell>
      <TableCell className="space-x-2">
        <button
          type="button"
          className="text-blue-500 hover:text-blue-700"
          onClick={() => onEdit(item)}
          title={editLabel}
        >
          ✎
        </button>
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
