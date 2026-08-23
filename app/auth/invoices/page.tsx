import React from "react";
import Error from "@/components/Error";
import InvoicesTable from "@/components/Invoices/InvoicesTable";
import { invoiceService } from "@/modules/invoices/service";

const InvoicesPage = async () => {
  try {
    const data = await invoiceService.getAllInvoices();
    return <InvoicesTable data={data} />;
  } catch (err) {
    console.log(err);
    return <Error />;
  }
};
export default InvoicesPage;
