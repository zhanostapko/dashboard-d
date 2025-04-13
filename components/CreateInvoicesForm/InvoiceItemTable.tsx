"use client";

import { FormEvent, useState } from "react";
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

type Props = {
  handleAdd: (item: InvoiceItem) => void;
  handleRemove: (id: number) => void;
  items: InvoiceItem[];
  errors?: string | string[];
};

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
  errors,
}: Props) {
  const [inputItem, setInputItem] =
    useState<Partial<InvoiceItem>>(initialInput);

  const onInputChange = (updatedItem: Partial<InvoiceItem>) => {
    setInputItem((prev) => {
      const newItem = { ...prev, ...updatedItem };

      return {
        ...newItem,
        total: (newItem.price || 0) * (newItem.quantity || 0),
      };
    });
  };

  const onInputClear = () => {
    setInputItem(initialInput);
  };

  // const handleUpdate = (updatedItem) => {
  //   setItems((prev) =>
  //     prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
  //   );
  // };

  const innerFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleAddItem();
  };

  const handleAddItem = () => {
    const input = document.querySelector(
      "input[name='name']"
    ) as HTMLInputElement;
    if (input && !input.checkValidity()) {
      input.reportValidity();
      return;
    }
    handleAdd({
      id: Date.now(),
      name: inputItem?.name || "",
      unit: inputItem?.unit || "",
      quantity: Number(inputItem?.quantity ?? 1),
      price: Number(inputItem?.price ?? 0),
      total: Number(inputItem?.total ?? 0),
      invoiceId: inputItem.invoiceId ?? 0,
    });

    setInputItem(initialInput);
  };

  return (
    <div className="p-4">
      <div onSubmit={innerFormSubmit}>
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
            <InvoiceItemInput
              item={inputItem}
              onChange={onInputChange}
              onClear={onInputClear}
            />
          </TableBody>
        </Table>
        <div className="flex justify-end">
          <Button
            onClick={handleAddItem}
            className=" item-right mt-4"
            type="submit"
            form="nested-form"
          >
            ➕ Add Item
          </Button>
        </div>
        {errors && (
          <p className=" inline-block border border-red-500 text-red-500 text-sm mt-1 p-2">
            {errors}
          </p>
        )}
      </div>
    </div>
  );
}
