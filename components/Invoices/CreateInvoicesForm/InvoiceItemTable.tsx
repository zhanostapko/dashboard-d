"use client";

import { useState } from "react";
import InvoiceItemRow from "./InvoiceItemRow";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InvoiceItemInput from "./InvoiceItemInput";
import { useLocaleData } from "@/components/General/I18nProvider";
import { InvoiceItemDto, invoiceItemSchema } from "@/modules/invoices/schema";

type InvoiceItemDraftErrors = Partial<Record<keyof InvoiceItemDto, string>>;

type Props = {
  handleAdd: (item: InvoiceItemDto) => void;
  handleRemove: (id: number) => void;
  handleUpdate: (item: InvoiceItemDto) => void;
  items: InvoiceItemDto[];
};

const createInitialItem = (): InvoiceItemDto => ({
  id: Date.now(),
  name: "",
  unit: "pcs",
  quantity: 1,
  price: 10.0,
  total: 10.0,
});

export default function InvoiceItemTable({
  handleAdd,
  handleRemove,
  handleUpdate,
  items,
}: Props) {
  const { actions, addItem, cancelEdit, editItem, name, price, quantity, saveItem, sum, type } = useLocaleData().ru.invoices.invoiceForm.invoiceItems;
  const [draftItem, setDraftItem] = useState<InvoiceItemDto>(createInitialItem);
  const [draftErrors, setDraftErrors] = useState<InvoiceItemDraftErrors>({});
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const handleDraftChange = <Field extends keyof InvoiceItemDto>(
    field: Field,
    value: InvoiceItemDto[Field]
  ) => {
    setDraftItem((current) => ({
      ...current,
      [field]: value,
      total:
        field === "price" || field === "quantity"
          ? Number(
              (field === "price" ? Number(value) : current.price) *
                (field === "quantity" ? Number(value) : current.quantity)
            )
          : current.total,
    }));
    setDraftErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleClear = () => {
    setDraftItem(createInitialItem());
    setDraftErrors({});
    setEditingItemId(null);
  };

  const handleEditItem = (item: InvoiceItemDto) => {
    setDraftItem(item);
    setDraftErrors({});
    setEditingItemId(item.id);
  };

  const handleSaveItem = () => {
    const item = {
      ...draftItem,
      id: editingItemId ?? Date.now(),
      total: draftItem.quantity * draftItem.price,
    };

    const parsed = invoiceItemSchema.safeParse(item);

    if (!parsed.success) {
      const nextErrors: InvoiceItemDraftErrors = {};

      for (const issue of parsed.error.issues) {
        const fieldName = issue.path[0] as keyof InvoiceItemDto | undefined;

        if (fieldName) {
          nextErrors[fieldName] = issue.message;
        }
      }

      setDraftErrors(nextErrors);
      return;
    }

    if (editingItemId) {
      handleUpdate(parsed.data);
    } else {
      handleAdd(parsed.data);
    }

    handleClear();
  };

  return (
    <div className="p-4">
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
              editLabel={editItem}
              key={item?.id}
              item={item}
              onEdit={handleEditItem}
              onRemove={() => handleRemove(item.id)}
            />
          ))}
          <InvoiceItemInput
            errors={draftErrors}
            item={draftItem}
            onChange={handleDraftChange}
            onClear={handleClear}
          />
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2">
        {editingItemId && (
          <Button
            onClick={handleClear}
            className="item-right mt-4"
            type="button"
            variant="outline"
          >
            {cancelEdit}
          </Button>
        )}
        <Button onClick={handleSaveItem} className="item-right mt-4" type="button">
          {editingItemId ? `✓ ${saveItem}` : `➕ ${addItem}`}
        </Button>
      </div>
    </div>
  );
}
