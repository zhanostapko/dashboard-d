"use client";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import InvoicePDFTemplate from "./InvoicePDFTemplate/InvoicePDFTemplate";
import { InvoiceWithDetails } from "@/types/invoice";

type Props = {
  invoice: InvoiceWithDetails;
};

export default function GeneratePDFButton({ invoice }: Props) {
  const handleClick = async () => {
    const blob = await pdf(<InvoicePDFTemplate invoice={invoice} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      Open PDF
    </Button>
  );
}
