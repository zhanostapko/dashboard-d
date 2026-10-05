"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useLocaleData } from "@/components/General/I18nProvider";
import { RepairItemDto } from "@/modules/repairs/schema";

export type RepairItemDraft = Omit<RepairItemDto, "quantity" | "price"> & {
  quantity: number | "";
  price: number | "";
};

type RepairItemDraftErrors = Partial<Record<keyof RepairItemDraft, string>>;

type Props = {
  errors: RepairItemDraftErrors;
  item: RepairItemDraft;
  onChange: <Field extends keyof RepairItemDraft>(
    field: Field,
    value: RepairItemDraft[Field]
  ) => void;
  onClear: () => void;
};

export default function RepairItemInput({
  errors,
  item,
  onChange,
  onClear,
}: Props) {
  const { materials, name, price, quantity, sum, type, work } = useLocaleData().ru.repairs.repairForm.repairItems;
  const visibleErrors = Object.entries(errors).filter(([, error]) => Boolean(error));
  const hasErrors = visibleErrors.length > 0;
  const numericQuantity = typeof item.quantity === "number" ? item.quantity : 0;
  const numericPrice = typeof item.price === "number" ? item.price : 0;

  return (
    <>
      <TableRow>
        <TableCell>
          <Input
            aria-label={name}
            value={item.name}
            onChange={(event) => onChange("name", event.target.value)}
          />
        </TableCell>
        <TableCell>
          <Select
            value={item.unit}
            onValueChange={(value) =>
              onChange("unit", value as RepairItemDto["unit"])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={type} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">{work}</SelectItem>
              <SelectItem value="materials">{materials}</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            aria-label={quantity}
            min={1}
            type="number"
            value={item.quantity}
            onChange={(event) =>
              onChange(
                "quantity",
                event.target.value === "" ? "" : Number(event.target.value)
              )
            }
          />
        </TableCell>
        <TableCell>
          <Input
            aria-label={price}
            min={0}
            step="0.01"
            type="number"
            value={item.price}
            onChange={(event) =>
              onChange(
                "price",
                event.target.value === "" ? "" : Number(event.target.value)
              )}
          />
        </TableCell>
        <TableCell>
          <Input
            aria-label={sum}
            disabled
            readOnly
            type="number"
            value={(numericQuantity * numericPrice).toFixed(2)}
          />
        </TableCell>
        <TableCell>
          <Button type="button" variant="destructive" onClick={onClear}>
            ✕
          </Button>
        </TableCell>
      </TableRow>

      {hasErrors && (
        <TableRow>
          <TableCell colSpan={6}>
            <div className="space-y-1 text-sm text-red-500">
              {visibleErrors.map(([field, error]) => (
                <div key={field}>• {error}</div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
