"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveVehicleAction } from "@/app/actions/vehicles";
import { useLocaleData } from "@/components/General/I18nProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VehicleDto } from "@/modules/vehicles/schema";

type Props = {
  onClose?: () => void;
  vehicle?: VehicleDto | null;
};

export default function CreateVehicleForm({ onClose, vehicle = null }: Props) {
  const router = useRouter();
  const data = useLocaleData();
  const [state, formAction, isPending] = useActionState(saveVehicleAction, {
    error: null,
    success: null,
    vehicle: null,
  });
  const { brand, model, plate, vin } = data.ru.repairs.repairForm.carInformation;
  const { createTitle, editTitle, addBtn, editBtn, loading } = data.ru.vehicles;
  const isEditing = vehicle !== null;

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onClose?.();
    }
  }, [onClose, router, state.success]);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">
        {isEditing ? editTitle : createTitle}
      </h1>
      {state.error && <p className="text-red-500">{state.error}</p>}
      <form action={formAction} className="space-y-4">
        {vehicle && <input type="hidden" name="vehicleId" value={vehicle.id} />}
        <div>
          <Label className="mb-2" htmlFor="brand">{brand}*</Label>
          <Input name="brand" defaultValue={state.vehicle?.brand ?? vehicle?.brand ?? ""} required />
        </div>
        <div>
          <Label className="mb-2" htmlFor="model">{model}*</Label>
          <Input name="model" defaultValue={state.vehicle?.model ?? vehicle?.model ?? ""} required />
        </div>
        <div>
          <Label className="mb-2" htmlFor="plate">{plate}</Label>
          <Input name="plate" defaultValue={state.vehicle?.plate ?? vehicle?.plate ?? ""} />
        </div>
        <div>
          <Label className="mb-2" htmlFor="vin">{vin}</Label>
          <Input name="vin" defaultValue={state.vehicle?.vin ?? vehicle?.vin ?? ""} />
        </div>
        <Button disabled={isPending} type="submit" className="w-full bg-green-500 text-white">
          {isPending ? loading : isEditing ? editBtn : addBtn}
        </Button>
      </form>
    </>
  );
}
