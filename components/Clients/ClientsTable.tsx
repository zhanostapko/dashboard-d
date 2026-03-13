"use client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalWrapper from "@/components/General/ModalWrapper";
import { Button } from "@/components/ui/button";
import data from "@/data/labels.json";
import { useRouter } from "next/navigation";
import { ClientDto } from "@/modules/clients/schema";
import Link from "next/link";
import CreateClientForm from "./CreateClientForm/CreateClientForm";

type Props = {
  clients: ClientDto[];
};

const ClientsTable = ({ clients }: Props) => {
  const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {
    nr,
    name,
    regNr,
    email,
    phone,
    actions,
    deleteClientBtn,
    editClientBtn,
    addClientBtn,
    loading,
  } = data.ru.clients;

  const deleteClient = async (clientId: number) => {
    try {
      setDeletingClientId(clientId);
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete client");
      }
      router.refresh();
    } catch (err) {
      console.log(err);
      setDeletingClientId(null);
    }
  };

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalContent={
          <CreateClientForm
            selectedClient={selectedClient}
            onClose={() => setIsOpen(false)}
          />
        }
      ></ModalWrapper>
      <Button
        onClick={() => {
          setSelectedClient(null);
          setIsOpen(true);
        }}
        className="mb-4"
      >
        + {addClientBtn}
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{nr}</TableHead>
            <TableHead>{name}</TableHead>
            <TableHead>{regNr}</TableHead>
            <TableHead>{phone}</TableHead>
            <TableHead>{email}</TableHead>
            <TableHead className="text-right">{actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client, index) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <Link
                  href={`/auth/clients/${client.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {client.name}
                </Link>
              </TableCell>
              <TableCell>{client.regNr || "-"}</TableCell>
              <TableCell>{client.phone || "-"}</TableCell>
              <TableCell>{client.email || "-"}</TableCell>
              <TableCell className="flex gap-4 justify-end">
                <Button
                  onClick={() => {
                    setSelectedClient(client);
                    setIsOpen(true);
                  }}
                >
                  {editClientBtn}
                </Button>
                <Button
                  disabled={deletingClientId === client.id}
                  onClick={() => deleteClient(client.id)}
                >
                  {deletingClientId === client.id ? loading : deleteClientBtn}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ClientsTable;
