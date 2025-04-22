"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form";
import { UseFormReturn } from "react-hook-form";
import { InvoiceItemInputValues } from "./InvoiceItemTable";

type Props = {
  localForm: UseFormReturn<InvoiceItemInputValues>;
  onClear: () => void;
};

export default function InvoiceItemInput({ localForm, onClear }: Props) {
  return (
    <>
      <TableRow>
        <TableCell>
          <FormField
            control={localForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Unit</FormLabel>
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
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
                <FormLabel>Price</FormLabel>
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
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summ</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    readOnly
                    disabled
                    value={
                      localForm.watch("price") * localForm.watch("quantity")
                    }
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
          <TableCell colSpan={6}>
            <div className="text-red-500 text-sm space-y-1">
              {Object.entries(localForm.formState.errors).map(
                ([field, error]) => (
                  <div key={field}>• {error?.message}</div>
                )
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
