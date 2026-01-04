"use client";
import React, { useState } from "react";
import ModalWrapper from "../General/ModalWrapper";
import CreateInvoiceForm from "./CreateInvoicesForm/CreateInvoiceForm";
import { Button } from "../ui/button";
import data from "@/data/labels.json";
import { InvoiceDto, InvoiceItemDto } from "@/modules/invoices/schema";

const editLabel = data.ru.invoices.invoiceForm.editInvoiceButton;

type Props = {
  invoice: InvoiceDto & {
    items: InvoiceItemDto[];
  };
};

const EditInvoiceButton = ({ invoice }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        disabled={invoice.status === "Paid"}
        onClick={() => {
          if (invoice.status === "Paid") return;
          setIsOpen(true);
        }}
        className="mb-4"
      >
        {editLabel}
      </Button>
      <ModalWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalContent={
          <CreateInvoiceForm
            editMode
            invoice={invoice}
            onClose={() => setIsOpen(false)}
          />
        }
      ></ModalWrapper>
    </>
  );
};

export default EditInvoiceButton;
