"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { InvoiceItemDto } from "@/modules/invoices/schema";

type Props = {
  editLabel: string;
  item: InvoiceItemDto;
  onEdit: (item: InvoiceItemDto) => void;
  onRemove: (id: number) => void;
};

export default function InvoiceItemRow({
  editLabel,
  item,
  onEdit,
  onRemove,
}: Props) {
  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.unit}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{item.price?.toFixed(2)}</TableCell>
      <TableCell>{item.total?.toFixed(2)}</TableCell>
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
