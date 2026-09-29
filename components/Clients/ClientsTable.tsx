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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import data from "@/data/labels.json";
import { useRouter } from "next/navigation";
import { ClientDto } from "@/modules/clients/schema";
import Link from "next/link";
import CreateClientForm from "./CreateClientForm/CreateClientForm";
import { deleteClientAction } from "@/app/actions/clients";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  clients: ClientDto[];
};

const ClientsTable = ({ clients }: Props) => {
  const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);
  const [clientToDelete, setClientToDelete] = useState<ClientDto | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
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

  const deleteClient = async () => {
    if (!clientToDelete) return;

    try {
      const clientId = clientToDelete.id;
      setDeletingClientId(clientId);
      const result = await deleteClientAction(clientId);

      if (!result.success) {
        throw new Error(result.error ?? "Не удалось удалить клиента.");
      }

      setDeleteError(null);
      setClientToDelete(null);
      setDeletingClientId(null);
      router.refresh();
    } catch (err) {
      setDeleteError((err as Error).message);
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
            key={selectedClient?.id ?? "new-client"}
            selectedClient={selectedClient}
            onClose={() => setIsOpen(false)}
          />
        }
      ></ModalWrapper>
      <Dialog
        open={!!clientToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setClientToDelete(null);
            setDeleteError(null);
            setDeletingClientId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить клиента?</DialogTitle>
            <DialogDescription>
              Клиент {clientToDelete?.name} будет скрыт из справочника. Уже
              созданные счета и ремонты сохранят свои данные.
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingClientId === clientToDelete?.id}
              onClick={deleteClient}
            >
              {deletingClientId === clientToDelete?.id ? loading : deleteClientBtn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button
        onClick={() => {
          setSelectedClient(null);
          setIsOpen(true);
        }}
        className="mb-4"
      >
        + {addClientBtn}
      </Button>
      {deleteError && !clientToDelete && (
        <p className="mb-4 text-sm text-red-500">{deleteError}</p>
      )}
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
              <TableCell className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title={editClientBtn}
                  aria-label={`${editClientBtn}: ${client.name}`}
                  onClick={() => {
                    setSelectedClient(client);
                    setIsOpen(true);
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title={deleteClientBtn}
                  aria-label={`${deleteClientBtn}: ${client.name}`}
                  disabled={deletingClientId === client.id}
                  onClick={() => setClientToDelete(client)}
                >
                  {deletingClientId === client.id ? (
                    <span className="text-xs">{loading}</span>
                  ) : (
                    <Trash2 className="size-4 text-destructive" />
                  )}
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
