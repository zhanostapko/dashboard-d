"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import labelsData from "@/data/labels.json";
import { InvoiceFormValues } from "@/modules/invoices/schema";
import InvoiceFormSection from "./InvoiceFormSection";

type Props = {
  dateLabel: string;
  invoiceId?: number;
  invoiceNumber?: string;
};

export default function InvoiceMainSection({
  dateLabel,
  invoiceId,
  invoiceNumber,
}: Props) {
  const form = useFormContext<InvoiceFormValues>();
  const { formInvoiceNumber } = labelsData.ru.invoices.invoiceForm;

  return (
    <InvoiceFormSection title={labelsData.ru.invoices.invoiceNumber}>
      <input
        type="hidden"
        {...form.register("id", { valueAsNumber: true })}
        value={invoiceId ?? 0}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {invoiceNumber ? (
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formInvoiceNumber}</FormLabel>
                <FormControl>
                  <div className="rounded-md border px-3 py-2">
                    <div>{invoiceNumber}</div>
                    <input type="hidden" {...field} value={field.value} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <input type="hidden" {...form.register("number")} />
        )}

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dateLabel}*</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </InvoiceFormSection>
  );
}
