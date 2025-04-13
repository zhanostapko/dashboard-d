"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InvoiceItem } from "@prisma/client";

type Props = {
  item: Partial<InvoiceItem>;
  onChange: (item: Partial<InvoiceItem>) => void;
  onClear: () => void;
};

export default function InvoiceItemInput({ item, onChange, onClear }: Props) {
  const handleChange = (field: string, value: string | number) => {
    onChange({ ...item, [field]: value });
  };

  return (
    <TableRow>
      <TableCell>
        <Input
          name="name"
          required
          value={item.name}
          onChange={(e) => handleChange("name", e.target.value)}
          form="nested-form"
        />
      </TableCell>
      <TableCell>
        <Input
          value={item.unit}
          onChange={(e) => handleChange("unit", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleChange("quantity", parseInt(e.target.value))}
          min={1}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.price}
          step="0.01"
          onChange={(e) => handleChange("price", parseFloat(e.target.value))}
          min={0}
        />
      </TableCell>
      <TableCell>{item.total?.toFixed(2)}</TableCell>
      <TableCell>
        <Button type="button" variant="destructive" onClick={onClear}>
          ✕
        </Button>
      </TableCell>
    </TableRow>
  );
}
