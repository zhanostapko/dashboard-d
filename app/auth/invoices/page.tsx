import React from "react";
import Error from "@/components/Error";
import InvoicesTable from "@/components/Invoices/InvoicesTable";
import { requirePageUser } from "@/lib/authz";
import { invoiceService } from "@/modules/invoices/service";

const InvoicesPage = async () => {
  const currentUser = await requirePageUser();

  try {
    const data = await invoiceService.getAllInvoices();
    return <InvoicesTable data={data} canManage={currentUser.role === "ADMIN"} />;
  } catch (err) {
    console.log(err);
    return <Error />;
  }
};
export default InvoicesPage;
