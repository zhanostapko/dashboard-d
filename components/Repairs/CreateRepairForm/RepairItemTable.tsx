"use client";

import RepairItemRow from "./RepairItemRow";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import RepairItemInput from "./RepairItemInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import data from "@/data/labels.json";
import { RepairItemDto, repairItemSchema } from "@/modules/repairs/schema";

const { actions, addItem, name, price, quantity, type } =
  data.ru.repairs.repairForm.repairItems;

type Props = {
  handleAdd: (item: RepairItemDto) => void;
  handleRemove: (id: number) => void;
  items: RepairItemDto[];
};

export default function RepairItemTable({
  handleAdd,
  handleRemove,
  items,
}: Props) {
  const initialInput: Partial<RepairItemDto> = {
    id: Date.now(),
    name: "",
    quantity: 1,
    price: 0,
  };
  const localForm = useForm<RepairItemDto>({
    resolver: zodResolver(repairItemSchema),
    defaultValues: initialInput,
  });

  const onInputClear = () => {
    localForm.reset();
  };

  const handleAddItem = localForm.handleSubmit((data) => {
    handleAdd({
      ...data,
      id: Date.now(),
    });

    localForm.reset();
  });

  return (
    <div className="p-4">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{name}</TableHead>
              <TableHead>{type}</TableHead>
              <TableHead>{quantity}</TableHead>
              <TableHead>{price}</TableHead>
              <TableHead>{actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <RepairItemRow
                key={item?.id}
                item={item}
                onRemove={() => handleRemove(item.id)}
              />
            ))}
            <RepairItemInput localForm={localForm} onClear={onInputClear} />
          </TableBody>
        </Table>
        <div className="flex justify-end">
          <Button
            onClick={handleAddItem}
            className=" item-right mt-4"
            type="submit"
          >
            {addItem}
          </Button>
        </div>
      </div>
    </div>
  );
}
