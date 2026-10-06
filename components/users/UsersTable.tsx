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
import { useLocaleData } from "@/components/General/I18nProvider";
import { deleteUserAction } from "@/app/actions/users";
import CreateUserForm from "./CreateUserForm/CreateUserForm";
import { useRouter } from "next/navigation";
import { UserDto } from "@/modules/users/schema";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  currentUserId: number;
  users: UserDto[];
};

const UsersTable = ({ currentUserId, users }: Props) => {
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserDto | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const data = useLocaleData();

  const {
    nr,
    firstName,
    lastName,
    email,
    role,
    baseRate,
    actions,
    deleteUserBtn,
    loading,
  } = data.ru.user;

  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      const userId = userToDelete.id;
      setDeletingUserId(userId);
      const result = await deleteUserAction(userId);

      if (!result.success) {
        throw new Error(result.error ?? data.ru.errors.deleteUser);
      }
      setDeleteError(null);
      setUserToDelete(null);
      router.refresh();
    } catch (err) {
      setDeleteError((err as Error).message);
      setDeletingUserId(null);
    }
  };

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalContent={
          <CreateUserForm
            selectedUser={selectedUser}
            onClose={() => setIsOpen(false)}
          />
        }
      ></ModalWrapper>
      <Dialog
        open={!!userToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setUserToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{data.ru.dialogs.deleteUser}</DialogTitle>
            <DialogDescription>
              Пользователь {userToDelete?.email} потеряет доступ к системе. Это
              действие нельзя отменить из интерфейса.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {data.ru.invoices.invoiceForm.invoiceItems.cancelEdit}
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingUserId === userToDelete?.id}
              onClick={deleteUser}
            >
              {deletingUserId === userToDelete?.id ? loading : deleteUserBtn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button
        onClick={() => {
          setSelectedUser(null);
          setIsOpen(true);
        }}
        className="mb-4"
      >
        + {data.ru.user.createUser}
      </Button>
      {deleteError && <p className="mb-4 text-sm text-red-500">{deleteError}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{nr}</TableHead>
            <TableHead>{email}</TableHead>
            <TableHead>{role}</TableHead>
            <TableHead>{baseRate}</TableHead>
            <TableHead>{firstName}</TableHead>
            <TableHead>{lastName}</TableHead>
            <TableHead className="w-[96px] text-right">{actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              className="cursor-pointer"
              onClick={() => {
                setSelectedUser(user);
                setIsOpen(true);
              }}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.baseRate.toFixed(2)}%</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.surname}</TableCell>
              <TableCell className="w-[96px]">
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title={data.ru.user.editUserBtn}
                    aria-label={`${data.ru.user.editUserBtn}: ${user.email}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedUser(user);
                      setIsOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                    <span className="sr-only">{data.ru.user.editUserBtn}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title={deleteUserBtn}
                    aria-label={`${deleteUserBtn}: ${user.email}`}
                    disabled={deletingUserId === user.id || user.id === currentUserId}
                    onClick={(event) => {
                      event.stopPropagation();
                      setUserToDelete(user);
                    }}
                  >
                    {deletingUserId === user.id ? (
                      <span className="text-xs">{loading}</span>
                    ) : (
                      <Trash2 className="size-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default UsersTable;
