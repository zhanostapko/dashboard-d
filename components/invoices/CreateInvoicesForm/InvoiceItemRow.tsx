"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { InvoiceItemDto } from "@/modules/invoices/schema";

type Props = {
  item: InvoiceItemDto;
  onRemove: (id: number) => void;
};

export default function InvoiceItemRow({ item, onRemove }: Props) {
  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.unit}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{item.price?.toFixed(2)}</TableCell>
      <TableCell>{item.total?.toFixed(2)}</TableCell>
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
