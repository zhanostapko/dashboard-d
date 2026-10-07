"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
import { InvoiceFormValues } from "@/modules/invoices/schema";
import InvoiceFormSection from "./InvoiceFormSection";

type Props = {
  showValidation: boolean;
  total: number;
  totalLabel: string;
};

export default function InvoiceSummarySection({
  showValidation,
  total,
  totalLabel,
}: Props) {
  const form = useFormContext<InvoiceFormValues>();

  return (
    <InvoiceFormSection title={totalLabel}>
      <FormField
        control={form.control}
        name="total"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex justify-end">
                <h2 className="py-2 text-2xl font-bold">{`${totalLabel}: ${total.toFixed(2)}`}</h2>
                <input type="hidden" {...field} value={total} />
              </div>
            </FormControl>
            {showValidation && <FormMessage />}
          </FormItem>
        )}
      />
    </InvoiceFormSection>
  );
}
