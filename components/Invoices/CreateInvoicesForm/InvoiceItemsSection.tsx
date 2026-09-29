"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import labelsData from "@/data/labels.json";
import { InvoiceFormValues, InvoiceItemDto } from "@/modules/invoices/schema";
import InvoiceFormSection from "./InvoiceFormSection";
import InvoiceItemTable from "./InvoiceItemTable";

type Props = {
  items: InvoiceItemDto[];
  onAddItem: (item: InvoiceItemDto) => void;
  onRemoveItem: (id: number) => void;
  onUpdateItem: (item: InvoiceItemDto) => void;
};

export default function InvoiceItemsSection({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: Props) {
  const form = useFormContext<InvoiceFormValues>();
  const { title } = labelsData.ru.invoices.invoiceForm.invoiceItems;

  return (
    <InvoiceFormSection title={title}>
      <FormField
        control={form.control}
        name="items"
        render={() => (
          <FormItem>
            <FormLabel>{title}*</FormLabel>
            <FormControl>
              <InvoiceItemTable
                items={items}
                handleAdd={onAddItem}
                handleRemove={onRemoveItem}
                handleUpdate={onUpdateItem}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </InvoiceFormSection>
  );
}
