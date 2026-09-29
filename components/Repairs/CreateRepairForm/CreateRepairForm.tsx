"use client";

import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "../../ui/button";
import { Form } from "../../ui/form";
import ErrorState from "@/components/Error";
import labelsData from "@/data/labels.json";
import { saveRepairAction, SaveRepairState } from "@/app/actions/repairs";
import { ClientDto } from "@/modules/clients/schema";
import {
  RepairDto,
  repairFormSchema,
  RepairFormValues,
  RepairItemDto,
} from "@/modules/repairs/schema";
import RepairClientSection from "./RepairClientSection";
import RepairItemsSection from "./RepairItemsSection";
import RepairMainSection from "./RepairMainSection";
import RepairSummarySection from "./RepairSummarySection";
import RepairVehicleSection from "./RepairVehicleSection";

type Props = {
  clients?: ClientDto[];
  editMode?: boolean;
  repair?: RepairDto;
};

const initialState: SaveRepairState = {
  errors: null,
  success: null,
  formData: null,
};

const CreateRepairForm = ({
  clients = [],
  editMode = false,
  repair,
}: Props) => {
  const router = useRouter();
  const [state, formAction, isSubmitting] = useActionState(
    saveRepairAction,
    initialState
  );
  const [items, setItems] = useState<RepairItemDto[]>(repair?.items || []);

  const { repairForm, date } = labelsData.ru.repairs;
  const { saveRepairButton, createRepairButton, saving } = repairForm;

  const form = useForm<RepairFormValues>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      id: repair?.id || 0,
      clientId: repair?.clientId ?? undefined,
      date: repair?.date ? format(new Date(repair.date), "yyyy-MM-dd") : "",
      clientName: repair?.clientName || "",
      clientPhone: repair?.clientPhone || "",
      carBrand: repair?.carBrand || "",
      carModel: repair?.carModel || "",
      carPlate: repair?.carPlate || "",
      carMileage: repair?.carMileage || "",
      items: repair?.items || [],
    },
  });

  useEffect(() => {
    if (state.success) {
      router.push("/auth/repairs");
      router.refresh();
    }
  }, [router, state.success]);

  function onSubmit(values: RepairFormValues) {
    startTransition(() => {
      formAction({ ...values });
    });
  }

  const handleAddItem = (item: RepairItemDto) => {
    const newItems = [...items, item];
    setItems(newItems);
    form.setValue("items", newItems, { shouldValidate: true });
  };

  const handleRemoveItem = (id: number) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    form.setValue("items", newItems, { shouldValidate: true });
  };

  const handleUpdateItem = (updatedItem: RepairItemDto) => {
    const newItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(newItems);
    form.setValue("items", newItems, { shouldValidate: true });
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <RepairMainSection dateLabel={date} repairId={repair?.id} />

          <RepairClientSection clients={clients} />

          <RepairVehicleSection />

          <RepairItemsSection
            items={items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
          />

          <RepairSummarySection total={total} />

          {state.errors && <ErrorState />}

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-green-500 text-white"
          >
            {isSubmitting
              ? saving
              : editMode
                ? saveRepairButton
                : createRepairButton}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateRepairForm;
