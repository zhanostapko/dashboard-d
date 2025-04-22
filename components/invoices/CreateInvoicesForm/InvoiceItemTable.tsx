"use client";

import InvoiceItemRow from "./InvoiceItemRow";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import InvoiceItemInput from "./InvoiceItemInput";
import { InvoiceItem } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceItemSchema } from "@/lib/schemas/schemas";
import { z } from "zod";

type Props = {
  handleAdd: (item: InvoiceItem) => void;
  handleRemove: (id: number) => void;
  items: InvoiceItem[];
};

export type InvoiceItemInputValues = z.infer<typeof invoiceItemSchema>;

const initialInput = {
  id: 1,
  name: "",
  unit: "pcs",
  quantity: 1,
  price: 10.0,
  total: 10.0,
};

export default function InvoiceItemTable({
  handleAdd,
  handleRemove,
  items,
}: Props) {
  const localForm = useForm<InvoiceItemInputValues>({
    resolver: zodResolver(invoiceItemSchema),
    defaultValues: initialInput,
  });

  const onInputClear = () => {
    localForm.reset();
  };

  const handleAddItem = localForm.handleSubmit((data) => {
    const total = data.quantity * data.price;

    handleAdd({
      id: Date.now(),
      ...data,
      total,
      invoiceId: 0,
    });

    localForm.reset();
  });

  return (
    <div className="p-4">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Summ</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <InvoiceItemRow
                key={item?.id}
                item={item}
                onRemove={() => handleRemove(item.id)}
              />
            ))}
            <InvoiceItemInput localForm={localForm} onClear={onInputClear} />
          </TableBody>
        </Table>
        <div className="flex justify-end">
          <Button
            onClick={handleAddItem}
            className=" item-right mt-4"
            type="submit"
          >
            ➕ Add Item
          </Button>
        </div>
      </div>
    </div>
  );
}
