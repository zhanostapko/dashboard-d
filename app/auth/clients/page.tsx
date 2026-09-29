import React from "react";
import Error from "@/components/Error";
import ClientsTable from "@/components/Clients/ClientsTable";
import data from "@/data/labels.json";
import { requirePageUser } from "@/lib/authz";
import { clientService } from "@/modules/clients/service";

const ClientsPage = async () => {
  await requirePageUser();

  try {
    const clients = await clientService.getAllClients();
    return <ClientsTable clients={clients} />;
  } catch (error) {
    console.error("Failed to load clients:", error);
    return (
      <div className="p-6">
        <p className="mb-4 text-red-500">{data.ru.clients.error}</p>
        <Error />
      </div>
    );
  }
};

export default ClientsPage;
