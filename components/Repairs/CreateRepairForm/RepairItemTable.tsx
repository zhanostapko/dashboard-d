"use client";

import { useState } from "react";
import RepairItemRow from "./RepairItemRow";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RepairItemInput from "./RepairItemInput";
import { useLocaleData } from "@/components/General/I18nProvider";
import { RepairItemDto, repairItemSchema } from "@/modules/repairs/schema";
import type { RepairItemDraft } from "./RepairItemInput";

type RepairItemDraftErrors = Partial<Record<keyof RepairItemDraft, string>>;

type Props = {
  handleAdd: (item: RepairItemDto) => void;
  handleRemove: (id: number) => void;
  handleUpdate: (item: RepairItemDto) => void;
  items: RepairItemDto[];
};

const createInitialItem = (): RepairItemDraft => ({
  id: Date.now(),
  name: "",
  unit: "work",
  quantity: 1,
  price: 0,
});

export default function RepairItemTable({
  handleAdd,
  handleRemove,
  handleUpdate,
  items,
}: Props) {
  const { actions, addItem, cancelEdit, editItem, name, price, quantity, saveItem, sum, type } = useLocaleData().ru.repairs.repairForm.repairItems;
  const [draftItem, setDraftItem] = useState<RepairItemDraft>(createInitialItem);
  const [draftErrors, setDraftErrors] = useState<RepairItemDraftErrors>({});
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const handleDraftChange = <Field extends keyof RepairItemDraft>(
    field: Field,
    value: RepairItemDraft[Field]
  ) => {
    setDraftItem((current) => ({
      ...current,
      [field]: value,
    }));
    setDraftErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleClear = () => {
    setDraftItem(createInitialItem());
    setDraftErrors({});
    setEditingItemId(null);
  };

  const handleEditItem = (item: RepairItemDto) => {
    setDraftItem({ ...item });
    setDraftErrors({});
    setEditingItemId(item.id);
  };

  const handleSaveItem = () => {
    const item = {
      ...draftItem,
      id: editingItemId ?? Date.now(),
    };

    const parsed = repairItemSchema.safeParse(item);

    if (!parsed.success) {
      const nextErrors: RepairItemDraftErrors = {};

      for (const issue of parsed.error.issues) {
        const fieldName = issue.path[0] as keyof RepairItemDto | undefined;

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
            <RepairItemRow
              editLabel={editItem}
              item={item}
              key={item.id}
              onEdit={handleEditItem}
              onRemove={() => handleRemove(item.id)}
            />
          ))}
          <RepairItemInput
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
            className="item-right mt-4"
            onClick={handleClear}
            type="button"
            variant="outline"
          >
            {cancelEdit}
          </Button>
        )}
        <Button className="item-right mt-4" onClick={handleSaveItem} type="button">
          {editingItemId ? `✓ ${saveItem}` : `➕ ${addItem}`}
        </Button>
      </div>
    </div>
  );
}
