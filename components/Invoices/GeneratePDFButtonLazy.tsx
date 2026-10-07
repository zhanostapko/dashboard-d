"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { InvoiceWithDetails } from "@/types/invoice";

const GeneratePDFButton = dynamic(() => import("./GeneratePDFButton"), {
  ssr: false,
  loading: () => (
    <Button disabled variant="outline">
      PDF
    </Button>
  ),
});

type Props = {
  invoice: InvoiceWithDetails;
};

export default function GeneratePDFButtonLazy({ invoice }: Props) {
  return <GeneratePDFButton invoice={invoice} />;
}
