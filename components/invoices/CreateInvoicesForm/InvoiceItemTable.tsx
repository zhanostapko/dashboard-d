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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import data from "@/data/labels.json";
import { InvoiceItemDto, invoiceItemSchema } from "@/modules/invoices/schema";

const { actions, addItem, name, price, quantity, sum, type } =
  data.ru.invoices.invoiceForm.invoiceItems;

type Props = {
  handleAdd: (item: InvoiceItemDto) => void;
  handleRemove: (id: number) => void;
  items: InvoiceItemDto[];
};

export default function InvoiceItemTable({
  handleAdd,
  handleRemove,
  items,
}: Props) {
  const initialInput = {
    id: Date.now(),
    name: "",
    unit: "pcs",
    quantity: 1,
    price: 10.0,
    total: 10.0,
  };
  const localForm = useForm<InvoiceItemDto>({
    resolver: zodResolver(invoiceItemSchema),
    defaultValues: initialInput,
  });

  const onInputClear = () => {
    localForm.reset();
  };

  const handleAddItem = localForm.handleSubmit((data) => {
    const total = data.quantity * data.price;

    handleAdd({
      ...data,
      id: Date.now(),
      total,
    });

    localForm.reset();
  });

  return (
    <div className="p-4">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{name}</TableHead>
              <TableHead>{type}</TableHead>
              <TableHead>{quantity}</TableHead>
              <TableHead>{price}</TableHead>
              <TableHead>{sum}</TableHead>
              <TableHead>{actions}</TableHead>
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
            ➕ {addItem}
          </Button>
        </div>
      </div>
    </div>
  );
}
