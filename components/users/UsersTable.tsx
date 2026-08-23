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
import CreateUserForm from "./CreateUserForm/CreateUserForm";
import { useRouter } from "next/navigation";
import { UserDto } from "@/modules/users/schema";

type Props = {
  users: UserDto[];
};

const UsersTable = ({ users }: Props) => {
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
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

  const deleteUser = async (userId: number) => {
    try {
      setDeletingUserId(userId);
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
      router.refresh();
    } catch (err) {
      console.log(err);
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
      <Button
        onClick={() => {
          setSelectedUser(null);
          setIsOpen(true);
        }}
        className="mb-4"
      >
        + {data.ru.user.createUser}
      </Button>
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
              <TableCell className="flex gap-4 justify-end">
                <Button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsOpen(true);
                  }}
                >
                  {editUserBtn}
                </Button>
                <Button
                  disabled={deletingUserId === user.id}
                  onClick={() => deleteUser(user.id)}
                >
                  {deletingUserId === user.id ? loading : deleteUserBtn}
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
