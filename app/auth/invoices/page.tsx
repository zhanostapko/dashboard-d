import InvoicesTable from "@/components/invoices/InvoicesTable";

import { getAllInvoices } from "@/lib/invoices";
import React from "react";

const InvoicesPage = async () => {
  const invoices = await getAllInvoices();

  return <InvoicesTable data={invoices} />;
};

export default InvoicesPage;
