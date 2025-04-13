"use client";
import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import CreateInvoiceForm from "./CreateInvoicesForm/CreateInvoiceForm";
import { Button } from "./ui/button";
import { Invoice, InvoiceItem } from "@prisma/client";

type Props = {
  invoice: Invoice & {
    items: InvoiceItem[];
  };
};

const EditInvoiceButton = ({ invoice }: Props) => {
  console.log(invoice, "invoice in edit button");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ModalWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modalContent={
        <CreateInvoiceForm invoice={invoice} onClose={() => setIsOpen(false)} />
      }
    >
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        className="mb-4"
      >
        Edit
      </Button>
    </ModalWrapper>
  );
};

export default EditInvoiceButton;
