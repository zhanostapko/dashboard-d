"use client";
import { useActionState, useEffect, useState } from "react";
import { saveUserAction } from "@/app/actions/users";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, User } from "@prisma/client";

type Props = {
  selectedUser?: User | null;
  onClose?: () => void;
};

export default function CreateUserForm({ selectedUser, onClose }: Props) {
  const [role, setRole] = useState<Role>(selectedUser?.role || Role.USER);
  const [state, formAction] = useActionState(saveUserAction, {
    error: null,
    success: null,
    user: selectedUser || null,
  });

  const handleSubmit = (formData: FormData) => {
    formData.append("role", role);
    formAction(formData);
  };

  useEffect(() => {
    console.log("success in effect");
    if (state.success) {
      console.log("inside conditions");
      onClose?.();
    }
  }, [state.success, onClose]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {selectedUser ? "Edit User" : "Create User"}
      </h1>

      {state.error && <p className="text-red-500">{state.error}</p>}
      {state.success && <p className="text-green-500">{state.success}</p>}

      <form action={handleSubmit} className="space-y-4">
        {selectedUser?.id && (
          <input type="hidden" name="id" value={selectedUser.id} />
        )}

        <div>
          <Label className="mb-2" htmlFor="email">
            Email*
          </Label>
          <Input
            name="email"
            defaultValue={state?.user?.email || ""}
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label className="mb-2" htmlFor="name">
              Name*
            </Label>
            <Input
              name="name"
              defaultValue={state?.user?.name || ""}
              required
            />
          </div>
          <div className="flex-1">
            <Label className="mb-2" htmlFor="surname">
              Surname
            </Label>
            <Input name="surname" defaultValue={state?.user?.surname || ""} />
          </div>
        </div>

        <div>
          <Label className="mb-2">Role*</Label>
          <Select
            defaultValue={role}
            onValueChange={(value) => setRole(value as Role)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-gray-400">* - Required field</p>

        <Button type="submit" className="w-full bg-green-500 text-white">
          {selectedUser ? "Update User" : "Create User"}
        </Button>
      </form>
    </>
  );
}
