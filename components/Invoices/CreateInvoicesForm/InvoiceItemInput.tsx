"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { useLocaleData } from "@/components/General/I18nProvider";
import { InvoiceItemDto } from "@/modules/invoices/schema";

type InvoiceItemDraftErrors = Partial<Record<keyof InvoiceItemDto, string>>;

type Props = {
  errors: InvoiceItemDraftErrors;
  item: InvoiceItemDto;
  onChange: <Field extends keyof InvoiceItemDto>(
    field: Field,
    value: InvoiceItemDto[Field]
  ) => void;
  onClear: () => void;
};

export default function InvoiceItemInput({
  errors,
  item,
  onChange,
  onClear,
}: Props) {
  const { name, price, quantity, sum, type } = useLocaleData().ru.invoices.invoiceForm.invoiceItems;
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
          <Input
            aria-label={type}
            value={item.unit}
            onChange={(event) => onChange("unit", event.target.value)}
          />
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
            value={item.total.toFixed(2)}
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
