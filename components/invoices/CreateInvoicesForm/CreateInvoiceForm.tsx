"use client";
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema } from "@/lib/schemas/schemas";
import { invoiceNumberGenerate } from "@/lib/invoices";
import { Input } from "../../ui/input";
import InvoiceItemTable from "./InvoiceItemTable";
import { Separator } from "../../ui/separator";
import { Invoice, InvoiceItem } from "@prisma/client";
import { format } from "date-fns";
import {
  InvoiceFormValues,
  saveInvoiceAction,
  SaveInvoiceState,
} from "@/app/actions/invoices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Error from "@/components/Error";

type Props = {
  onClose: () => void;
  invoice?: Invoice & {
    items: InvoiceItem[];
  };
  editMode?: boolean;
};

const initialState: SaveInvoiceState = {
  errors: null,
  success: null,
  formData: null,
};

const CreateInvoiceForm = ({ invoice, onClose, editMode = false }: Props) => {
  const [state, formAction, isSubmitting] = useActionState(
    saveInvoiceAction,
    initialState
  );
  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.number || "");
  const [total, setTotal] = useState(invoice?.total || 0);
  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || []);
  const [validatedTotal, setValidatedTotal] = useState(false);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);
  useEffect(() => {
    if (!invoice?.number) {
      const generatedInvoiceNumber = async () => {
        const number = await invoiceNumberGenerate();
        setInvoiceNumber(number);
        form.setValue("number", number, { shouldValidate: true });
      };
      generatedInvoiceNumber();
    } else {
      form.setValue("number", invoice.number);
    }
  }, [invoice?.number]);

  useEffect(() => {
    const total = items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    setTotal(total);
    form.setValue("total", total, { shouldValidate: validatedTotal });
  }, [items]);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      id: invoice?.id || 0,
      date: invoice?.date ? format(new Date(invoice.date), "yyyy-MM-dd") : "",
      clientName: invoice?.clientName || "",
      clientRegNr: invoice?.clientRegNr || "",
      clientAddress: invoice?.clientAddress || "",
      clientBank: invoice?.carBrand || "",
      clientBankCode: invoice?.clientBankCode || "",
      clientAccount: invoice?.clientAccount || "",
      clientEmail: invoice?.clientEmail || "",
      clientPhone: invoice?.clientPhone || "",
      carBrand: invoice?.carBrand || "",
      carModel: invoice?.carModel || "",
      carPlate: invoice?.carPlate || "",
      carMileage: invoice?.carMileage || "",
      paymentType: invoice?.paymentType || "NonCash",
      items: invoice?.items || [],
    },
  });

  function onSubmit(values: InvoiceFormValues) {
    console.log("Form submitted");
    console.log(values, "values");
    setValidatedTotal(true);

    startTransition(() => {
      formAction({ ...values });
    });

    console.log(values);
  }

  const handleAddInvoiceItem = (item: InvoiceItem) => {
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

  return (
    <div className=" space-y-2">
      <h2 className="text-2xl font-bold mb-4">
        {editMode ? "Edit Invoice" : "Create Invoice"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <div>
                        <div> {invoiceNumber}</div>
                        <input type="hidden" {...field} value={invoiceNumber} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <input
                type="hidden"
                {...form.register("id")}
                value={invoice?.id || ""}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <h3 className="text-md font-bold mb-4">Client information</h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name*</FormLabel>
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
                  <FormLabel>Client Registration Number*</FormLabel>
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
                  <FormLabel>Address*</FormLabel>
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
                  <FormLabel>Client Email</FormLabel>
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
                  <FormLabel>Client Phone</FormLabel>
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
                  <FormLabel>Payment type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="NonCash">Non cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4 mt-4">
            <FormField
              control={form.control}
              name="clientBank"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Bank*</FormLabel>
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
                <FormItem className="flex-1">
                  <FormLabel>Bank Code*</FormLabel>
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
                <FormItem className="flex-1">
                  <FormLabel>Account*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <h3 className="text-md font-bold mb-4">Car information</h3>

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="carBrand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand*</FormLabel>
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
                  <FormLabel>Model*</FormLabel>
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
                  <FormLabel>Plate*</FormLabel>
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
                  <FormLabel>Mileage</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <FormLabel>Invoice Items*</FormLabel>
                <FormControl>
                  <InvoiceItemTable
                    items={items}
                    handleAdd={handleAddInvoiceItem}
                    handleRemove={handleRemoveInvoiceItem}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex justify-end">
                    <h2 className="font-bold text-2xl py-2">{`Total: ${total}`}</h2>
                    <input type="hidden" {...field} value={total} />
                  </div>
                </FormControl>
                {validatedTotal && <FormMessage />}
              </FormItem>
            )}
          />

          {state.errors && <Error />}

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-green-500 text-white"
          >
            {isSubmitting ? "Sending..." : editMode ? "Save" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateInvoiceForm;
