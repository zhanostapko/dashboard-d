import React from "react";
import ClientsTable from "@/components/Clients/ClientsTable";
import data from "@/data/labels.json";
import { clientService } from "@/modules/clients/service";

const ClientsPage = async () => {
  let clients;

  try {
    clients = await clientService.getAllClients();
  } catch (error) {
    console.error("Failed to load clients:", error);
    return <p className="text-red-500">{data.ru.clients.error}</p>;
  }

  return <ClientsTable clients={clients} />;
};

export default ClientsPage;
