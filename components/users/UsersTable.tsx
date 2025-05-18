"use client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalWrapper from "@/components/General/ModalWrapper";
import { Button } from "@/components/ui/button";
import CreateUserForm from "@/components/users/CreateUserForm/CreateUserForm";
import { User } from "@prisma/client";
import data from "@/data/labels.json";

type Props = {
  users: User[];
};

const UsersTable = ({ users }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    nr,
    firstName,
    lastName,
    email,
    role,
    actions,
    deleteUserBtn,
    editUserBtn,
  } = data.ru.user;

  const deleteUser = async (userId: number) => {
    const res = await fetch(`/api/users?userId=${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete user");
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
                <Button onClick={() => deleteUser(user.id)}>
                  {deleteUserBtn}
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
