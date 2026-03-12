"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import data from "@/data/labels.json";
import { RepairItemDto } from "@/modules/repairs/schema";

const { name, price, quantity, type, work, materials } =
  data.ru.repairs.repairForm.repairItems;

type Props = {
  localForm: UseFormReturn<RepairItemDto>;
  onClear: () => void;
};

export default function RepairItemInput({ localForm, onClear }: Props) {
  return (
    <>
      <TableRow>
        <TableCell>
          <FormField
            control={localForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={localForm.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{type}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "work"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">{work}</SelectItem>
                      <SelectItem value="materials">{materials}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={localForm.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{quantity}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={localForm.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{price}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <Button type="button" variant="destructive" onClick={onClear}>
            ✕
          </Button>
        </TableCell>
      </TableRow>

      {Object.keys(localForm.formState.errors).length > 0 && (
        <TableRow>
          <TableCell colSpan={5}>
            <div className="text-red-500 text-sm space-y-1">
              {Object.entries(localForm.formState.errors).map(
                ([field, error]) => (
                  <div key={field}> {error?.message}</div>
                ),
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
