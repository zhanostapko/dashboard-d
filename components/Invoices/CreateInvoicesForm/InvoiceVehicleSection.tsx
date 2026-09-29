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

export default function InvoiceVehicleSection() {
  const form = useFormContext<InvoiceFormValues>();
  const { brand, mileage, model, plate, title } =
    labelsData.ru.invoices.invoiceForm.carInformation;

  return (
    <InvoiceFormSection title={title}>
      <div className="grid gap-4 md:grid-cols-4">
        <FormField
          control={form.control}
          name="carBrand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{brand}*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="carModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{model}*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="carPlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{plate}*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="carMileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{mileage}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </InvoiceFormSection>
  );
}
