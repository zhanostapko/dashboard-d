"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalWrapper from "@/components/ModalWrapper";
import { Button } from "@/components/ui/button";
// Suppose you have a CreateInvoiceForm similar to your CreateUserForm
import CreateInvoiceForm from "@/components/CreateInvoicesForm/CreateInvoiceForm";
import { Invoice } from "@prisma/client";
import { InvoicePreview } from "@/lib/invoices";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  data: InvoicePreview[];
};

const InvoicesTable = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const deleteInvoice = async (invoiceId: number) => {
    const res = await fetch(`/api/invoices?invoiceId=${invoiceId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete invoice");
    }
  };

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalContent={<CreateInvoiceForm onClose={() => setIsOpen(false)} />}
      >
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
          className="mb-4"
        >
          + Add Invoice
        </Button>
      </ModalWrapper>

      <Table>
        <TableCaption>List of invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Nr</TableHead>
            <TableHead>Invoice #</TableHead>
            <TableHead>Client name</TableHead>
            <TableHead>Car plate</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((invoice, index) => (
            <TableRow
              className="cursor-pointer"
              key={invoice.id}
              onClick={() => router.push(`/auth/invoices/${invoice.id}`)}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{invoice.number}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>{invoice.carPlate}</TableCell>
              <TableCell>
                {
                  new Date(invoice.date).toLocaleDateString(
                    "en-US"
                  ) /* or any format */
                }
              </TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice.total}</TableCell>
              <TableCell className="flex gap-4 justify-end">
                <Button
                  onClick={() => {
                    deleteInvoice(invoice.id);
                  }}
                >
                  Delete
                </Button>
                {/* You could also have a “View” button if you want a details page */}
                {/* <Button>View</Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default InvoicesTable;
