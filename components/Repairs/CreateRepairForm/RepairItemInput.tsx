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
import data from "@/data/labels.json";
import { RepairItemDto } from "@/modules/repairs/schema";

const { materials, name, price, quantity, sum, type, work } =
  data.ru.repairs.repairForm.repairItems;

type RepairItemDraftErrors = Partial<Record<keyof RepairItemDto, string>>;

type Props = {
  errors: RepairItemDraftErrors;
  item: RepairItemDto;
  onChange: <Field extends keyof RepairItemDto>(
    field: Field,
    value: RepairItemDto[Field]
  ) => void;
  onClear: () => void;
};

export default function RepairItemInput({
  errors,
  item,
  onChange,
  onClear,
}: Props) {
  const hasErrors = Object.keys(errors).length > 0;

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
              onChange("quantity", Number(event.target.value))
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
            onChange={(event) => onChange("price", Number(event.target.value))}
          />
        </TableCell>
        <TableCell>
          <Input
            aria-label={sum}
            disabled
            readOnly
            type="number"
            value={(item.quantity * item.price).toFixed(2)}
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
              {Object.entries(errors).map(([field, error]) => (
                <div key={field}>• {error}</div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
