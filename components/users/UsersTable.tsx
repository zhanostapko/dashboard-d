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

  const {
    nr,
    firstName,
    lastName,
    email,
    role,
    actions,
    deleteUserBtn,
    editUserBtn,
    loading,
  } = data.ru.user;

  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      const userId = userToDelete.id;
      setDeletingUserId(userId);
      const result = await deleteUserAction(userId);

      if (!result.success) {
        throw new Error(result.error ?? "Не удалось удалить пользователя.");
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
            <DialogTitle>Удалить пользователя?</DialogTitle>
            <DialogDescription>
              Пользователь {userToDelete?.email} потеряет доступ к системе. Это
              действие нельзя отменить из интерфейса.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Отмена
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
            <TableHead>{firstName}</TableHead>
            <TableHead>{lastName}</TableHead>
            <TableHead className="text-right">{actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.surname}</TableCell>
              <TableCell className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title={editUserBtn}
                  aria-label={`${editUserBtn}: ${user.email}`}
                  onClick={() => {
                    setSelectedUser(user);
                    setIsOpen(true);
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title={deleteUserBtn}
                  aria-label={`${deleteUserBtn}: ${user.email}`}
                  disabled={deletingUserId === user.id || user.id === currentUserId}
                  onClick={() => setUserToDelete(user)}
                >
                  {deletingUserId === user.id ? (
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

export default UsersTable;
