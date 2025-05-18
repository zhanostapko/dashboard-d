"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { InvoiceWithDetails } from "@/types/invoice";

type Props = {
  invoice: InvoiceWithDetails;
};

const DeleteInvoiceButton = ({ invoice }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const deleteInvoice = async (invoiceId: number) => {
    setIsLoading(true);
    const res = await fetch(`/api/invoices?invoiceId=${invoiceId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete invoice");
    }
    setIsLoading(false);
    router.push("/auth/invoices");
  };
  return (
    <Button
      disabled={isLoading || invoice.status === "Paid"}
      onClick={() => {
        deleteInvoice(invoice.id);
      }}
    >
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
};

export default DeleteInvoiceButton;
