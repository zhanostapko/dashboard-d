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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocaleData } from "@/components/General/I18nProvider";
import { InvoiceFormValues } from "@/modules/invoices/schema";
import InvoiceFormSection from "./InvoiceFormSection";

export default function InvoiceClientSection() {
  const form = useFormContext<InvoiceFormValues>();
  const labelsData = useLocaleData();
  const {
    account,
    address,
    bank,
    bankCode,
    cash,
    clientName,
    clientRegistrationNumber,
    email,
    nonCash,
    paymentType,
    phone,
    title,
  } = labelsData.ru.invoices.invoiceForm.clientInformation;

  return (
    <InvoiceFormSection title={title}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{clientName}*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientRegNr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{clientRegistrationNumber}*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{address}*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{email}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{phone}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{paymentType}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">{cash}</SelectItem>
                    <SelectItem value="NonCash">{nonCash}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="clientBank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{bank}*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientBankCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{bankCode}*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientAccount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{account}*</FormLabel>
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
