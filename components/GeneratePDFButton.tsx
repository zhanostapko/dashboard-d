// components/GeneratePDFButton.tsx
"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDFTemplate from "./InvoicePDFTemplate";
import { Button } from "@/components/ui/button";

export default function GeneratePDFButton({ invoice }: { invoice: any }) {
  return (
    <PDFDownloadLink
      document={<InvoicePDFTemplate invoice={invoice} />}
      fileName={`Invoice-${invoice.number}.pdf`}
    >
      {({ loading }) => (
        <Button variant="outline">
          {loading ? "Generating PDF..." : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
