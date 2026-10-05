"use client";

import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "../../ui/button";
import { Form } from "../../ui/form";
import ErrorState from "@/components/Error";
import labelsData from "@/data/labels.json";
import { saveInvoiceAction, SaveInvoiceState } from "@/app/actions/invoices";
import {
  InvoiceDto,
  invoiceFormSchema,
  InvoiceFormValues,
  InvoiceItemDto,
} from "@/modules/invoices/schema";
import InvoiceClientSection from "./InvoiceClientSection";
import InvoiceItemsSection from "./InvoiceItemsSection";
import InvoiceMainSection from "./InvoiceMainSection";
import InvoiceSummarySection from "./InvoiceSummarySection";
import InvoiceVehicleSection from "./InvoiceVehicleSection";

type Props = {
  invoice?: InvoiceDto & {
    items: InvoiceItemDto[];
  };
  editMode?: boolean;
  prefill?: InvoicePrefill;
};

export type InvoicePrefill = {
  repairId: number;
  date: string;
  clientName: string;
  clientRegNr: string;
  clientAddress: string;
  clientBank: string;
  clientBankCode: string;
  clientAccount: string;
  clientPhone: string;
  clientEmail: string;
  carBrand: string;
  carModel: string;
  carPlate: string;
  carMileage: string;
  items: InvoiceItemDto[];
};

const initialState: SaveInvoiceState = {
  errors: null,
  success: null,
  formData: null,
};

const CreateInvoiceForm = ({ invoice, editMode = false, prefill }: Props) => {
  const router = useRouter();
  const [state, formAction, isSubmitting] = useActionState(
    saveInvoiceAction,
    initialState
  );
  const [total, setTotal] = useState(invoice?.total || 0);
  const [items, setItems] = useState<InvoiceItemDto[]>(
    invoice?.items || prefill?.items || []
  );
  const [validatedTotal, setValidatedTotal] = useState(false);

  const { invoiceForm, date, total: totalLabel } = labelsData.ru.invoices;
  const { saveInvoiceButton, createInvoiceButton, saving } = invoiceForm;

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      id: invoice?.id || 0,
      repairId: invoice?.repairId ?? prefill?.repairId,
      number: invoice?.number || "AUTO",
      date: invoice?.date
        ? format(new Date(invoice.date), "yyyy-MM-dd")
        : prefill?.date
          ? format(new Date(prefill.date), "yyyy-MM-dd")
          : "",
      clientName: invoice?.clientName || prefill?.clientName || "",
      clientRegNr: invoice?.clientRegNr || prefill?.clientRegNr || "",
      clientAddress: invoice?.clientAddress || prefill?.clientAddress || "",
      clientBank: invoice?.clientBank || prefill?.clientBank || "",
      clientBankCode: invoice?.clientBankCode || prefill?.clientBankCode || "",
      clientAccount: invoice?.clientAccount || prefill?.clientAccount || "",
      clientEmail: invoice?.clientEmail || prefill?.clientEmail || "",
      clientPhone: invoice?.clientPhone || prefill?.clientPhone || "",
      carBrand: invoice?.carBrand || prefill?.carBrand || "",
      carModel: invoice?.carModel || prefill?.carModel || "",
      carPlate: invoice?.carPlate || prefill?.carPlate || "",
      carMileage: invoice?.carMileage || prefill?.carMileage || "",
      paymentType: invoice?.paymentType || "NonCash",
      items: invoice?.items || [],
      total: invoice?.total || 0,
    },
  });

  useEffect(() => {
    if (state.success) {
      router.push("/auth/invoices");
      router.refresh();
    }
  }, [router, state.success]);

  useEffect(() => {
    const nextTotal = items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    setTotal(nextTotal);
    form.setValue("total", nextTotal, { shouldValidate: validatedTotal });
  }, [items, form, validatedTotal]);

  function onSubmit(values: InvoiceFormValues) {
    setValidatedTotal(true);

    startTransition(() => {
      formAction({ ...values });
    });
  }

  const handleAddInvoiceItem = (item: InvoiceItemDto) => {
    const newItems = [...items, item];
    setItems(newItems);
    form.setValue("items", newItems, { shouldValidate: true });
    setValidatedTotal(true);
  };

  const handleRemoveInvoiceItem = (id: number) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    form.setValue("items", newItems, { shouldValidate: true });
  };

  const handleUpdateInvoiceItem = (updatedItem: InvoiceItemDto) => {
    const newItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(newItems);
    form.setValue("items", newItems, { shouldValidate: true });
    setValidatedTotal(true);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <InvoiceMainSection
            dateLabel={date}
            invoiceId={invoice?.id}
            invoiceNumber={invoice?.number}
          />

          <InvoiceClientSection />

          <InvoiceVehicleSection />

          <InvoiceItemsSection
            items={items}
            onAddItem={handleAddInvoiceItem}
            onRemoveItem={handleRemoveInvoiceItem}
            onUpdateItem={handleUpdateInvoiceItem}
          />

          <InvoiceSummarySection
            showValidation={validatedTotal}
            total={total}
            totalLabel={totalLabel}
          />

          {state.errors && <ErrorState />}

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-green-500 text-white"
          >
            {isSubmitting
              ? saving
              : editMode
                ? saveInvoiceButton
                : createInvoiceButton}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateInvoiceForm;
