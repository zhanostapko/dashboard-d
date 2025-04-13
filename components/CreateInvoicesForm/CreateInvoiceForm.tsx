"use client";
import React, { useActionState, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";

// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { saveInvoiceAction, SaveInvoiceState } from "@/app/actions/invoices";
import InvoiceItemTable from "./InvoiceItemTable";
import { Invoice, InvoiceItem } from "@prisma/client";
import { invoiceNumberGenerate } from "@/lib/invoices";
import { format } from "date-fns";

const initialState: SaveInvoiceState = {
  errors: null,
  success: null,
  formData: {},
};

type Props = {
  onClose: () => void;
  invoice?: Invoice & {
    items: InvoiceItem[];
  };
};

export default function CreateInvoiceForm({ invoice, onClose }: Props) {
  console.log(invoice, "invoice in create invoice form");
  // const [officialInvoice, setOfficialInvoice] = useState(false);
  const [state, formAction] = useActionState(saveInvoiceAction, initialState);
  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || []);
  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.number || "");

  const calculateInvoiceTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };
  const total = calculateInvoiceTotal();

  console.log(state, "state in create invoice form");

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  useEffect(() => {
    if (!invoice?.number) {
      const generatedInvoiceNumber = async () => {
        const invoiceNumber = await invoiceNumberGenerate();
        setInvoiceNumber(invoiceNumber);
      };
      generatedInvoiceNumber();
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    formData.append("items", JSON.stringify(items));
    formData.append("number", invoiceNumber);
    formData.append("total", `${total}`);
    formAction(formData);
  };

  const handleRemoveInvoiceItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item?.id !== id));
  };

  const handleAddInvoiceItem = (item: InvoiceItem) => {
    setItems((prev) => [...prev, item]);
  };

  return (
    <div className=" space-y-2">
      <h2 className="text-2xl font-bold mb-4">{"Create Invoice"}</h2>

      <form action={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div>Invoice Number {invoiceNumber}</div>
            {/* <RadioGroup
              onValueChange={handleRadioButtons}
              defaultValue={"private"}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Private</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="official" id="official" />
                <Label htmlFor="official">Official</Label>
              </div>
            </RadioGroup> */}
          </div>
          <div className="flex-1">
            <input type="hidden" name="id" value={invoice?.id || ""} />
            <Label className="mb-2" htmlFor="date">
              Date*
            </Label>
            <Input
              type="date"
              name="date"
              id="date"
              defaultValue={
                invoice?.date
                  ? format(new Date(invoice?.date), "yyyy-MM-dd")
                  : state.formData.date?.toString() || ""
              }
              required
              className={state.errors?.date ? "border-red-500" : ""}
            />
            {state.errors?.date && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.date[0]}
              </p>
            )}
          </div>
        </div>

        <input type="hidden" name="supplierId" value="1" />
        <h3 className="text-md font-bold mb-4">Client information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2" htmlFor="clientName">
              Client Name*
            </Label>
            <Input
              name="clientName"
              id="clientName"
              required
              defaultValue={
                invoice?.clientName || state.formData.clientName || ""
              }
              className={state.errors?.clientName ? "border-red-500" : ""}
            />
            {state.errors?.clientName && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.clientName[0]}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2" htmlFor="clientRegNr">
              {`Client registration number*`}
            </Label>
            <Input
              name="clientRegNr"
              id="clientRegNr"
              required
              defaultValue={
                invoice?.clientRegNr || state.formData.clientRegNr || ""
              }
              className={state.errors?.clientRegNr ? "border-red-500" : ""}
            />
            {state.errors?.clientRegNr && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.clientRegNr[0]}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2" htmlFor="clientAddress">
              Address*
            </Label>
            <Input
              name="clientAddress"
              id="clientAddress"
              required
              defaultValue={
                invoice?.clientAddress || state.formData.clientAddress || ""
              }
              className={state.errors?.clientAddress ? "border-red-500" : ""}
            />
            {state.errors?.clientAddress && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.clientAddress[0]}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2" htmlFor="clientEmail">
              Client Email
            </Label>
            <Input
              type="email"
              name="clientEmail"
              id="clientEmail"
              defaultValue={
                invoice?.clientEmail || state.formData.clientEmail || ""
              }
              className={state.errors?.clientEmail ? "border-red-500" : ""}
            />
            {state.errors?.clientEmail && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.clientEmail[0]}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2" htmlFor="clientPhone">
              Client Phone
            </Label>
            <Input
              name="clientPhone"
              id="clientPhone"
              defaultValue={
                invoice?.clientPhone || state.formData.clientPhone || ""
              }
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-[0.75]">
            <Label className="mb-2" htmlFor="clientBank">
              Bank*
            </Label>
            <Input
              name="clientBank"
              id="clientBank"
              required
              defaultValue={
                invoice?.clientBank || state.formData.clientBank || ""
              }
              className={state.errors?.clientBank ? "border-red-500" : ""}
            />
            {state.errors?.clientBank && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.clientBank[0]}
              </p>
            )}
          </div>
          <div className="flex-[0.75]">
            <Label className="mb-2" htmlFor="clientBankCode">
              Bank code*
            </Label>
            <Input
              name="clientBankCode"
              id="clientBankCode"
              required
              defaultValue={
                invoice?.clientBankCode || state.formData.clientBankCode || ""
              }
              className={state.errors?.clientBankCode ? "border-red-500" : ""}
            />
            {state.errors?.clientBankCode && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.clientBankCode[0]}
              </p>
            )}
          </div>
          <div className="flex-1">
            <Label className="mb-2" htmlFor="clientAccount">
              Account*
            </Label>
            <Input
              name="clientAccount"
              id="clientAccount"
              required
              defaultValue={
                invoice?.clientAccount || state.formData.clientAccount || ""
              }
              className={state.errors?.clientAccount ? "border-red-500" : ""}
            />
            {state.errors?.clientAccount && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.clientAccount[0]}
              </p>
            )}
          </div>
        </div>

        <Separator />
        <h3 className="text-md font-bold mb-4">Car information</h3>
        <div className="flex gap-4">
          <div>
            <Label className="mb-2" htmlFor="carBrand">
              Brand*
            </Label>
            <Input
              name="carBrand"
              id="carBrand"
              required
              defaultValue={invoice?.carBrand || state.formData.carBrand || ""}
              className={state.errors?.carBrand ? "border-red-500" : ""}
            />
            {state.errors?.carBrand && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.carBrand[0]}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2" htmlFor="carModel">
              Model*
            </Label>
            <Input
              name="carModel"
              id="Model"
              required
              defaultValue={invoice?.carModel || state.formData.carModel || ""}
              className={state.errors?.carModel ? "border-red-500" : ""}
            />
            {state.errors?.carModel && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.carModel[0]}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2" htmlFor="carPlate">
              Plate*
            </Label>
            <Input
              name="carPlate"
              id="carPlate"
              required
              defaultValue={invoice?.carPlate || state.formData.carPlate || ""}
              className={state.errors?.carPlate ? "border-red-500" : ""}
            />
            {state.errors?.carPlate && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.carPlate[0]}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <h2 className="font-semibold">Invoice Items*</h2>
          <InvoiceItemTable
            items={items}
            handleAdd={handleAddInvoiceItem}
            handleRemove={handleRemoveInvoiceItem}
            errors={state.errors?.items}
          />
        </div>

        <div>
          Total Amount
          <p>{total}</p>
        </div>

        <p className="text-sm text-gray-400">* - Required field</p>

        <Button type="submit" className="w-full bg-green-500 text-white">
          {"Create Invoice"}
        </Button>
      </form>
      <form id="nested-form"></form>
    </div>
  );
}
