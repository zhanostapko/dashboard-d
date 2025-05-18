import Error from "@/components/Error";
import InvoicesTable from "@/components/invoices/InvoicesTable";

import { getAllInvoices } from "@/lib/invoices";
import React from "react";

const InvoicesPage = async () => {
  try {
    const data = await getAllInvoices();
    return <InvoicesTable data={data} />;
  } catch (err) {
    console.log(err);
    return <Error />;
  }
};
export default InvoicesPage;
