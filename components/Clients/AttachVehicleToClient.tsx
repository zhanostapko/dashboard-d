"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { attachVehicleToClientAction } from "@/app/actions/vehicles";
import { useLocaleData } from "@/components/General/I18nProvider";
import { VehicleDto } from "@/modules/vehicles/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  clientId: number;
  vehicles: VehicleDto[];
  attachedVehicleIds: number[];
};

const vehicleLabel = (vehicle: VehicleDto) =>
  [vehicle.brand, vehicle.model, vehicle.plate].filter(Boolean).join(" · ");

export default function AttachVehicleToClient({
  clientId,
  vehicles,
  attachedVehicleIds,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loadingVehicleId, setLoadingVehicleId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const labelsData = useLocaleData();
  const {
    attachVehicle: attachVehicleLabel,
    searchVehicle,
    noAvailableVehicles,
    attaching,
  } =
    labelsData.ru.clients;

  const availableVehicles = useMemo(() => {
    const attached = new Set(attachedVehicleIds);
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return vehicles.filter((vehicle) => {
      if (attached.has(vehicle.id)) return false;
      if (!normalizedQuery) return true;

      return [vehicle.brand, vehicle.model, vehicle.plate, vehicle.vin]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase().includes(normalizedQuery));
    });
  }, [attachedVehicleIds, query, vehicles]);

  const attachVehicle = async (vehicleId: number) => {
    setLoadingVehicleId(vehicleId);
    setError(null);
    const result = await attachVehicleToClientAction(vehicleId, clientId);

    if (!result.success) {
      setError(result.error ?? labelsData.ru.errors.attachVehicle);
      setLoadingVehicleId(null);
      return;
    }

    setLoadingVehicleId(null);
    setQuery("");
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setQuery("");
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          {attachVehicleLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{attachVehicleLabel}</DialogTitle>
          <DialogDescription>{searchVehicle}</DialogDescription>
        </DialogHeader>

        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchVehicle}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="max-h-72 space-y-2 overflow-y-auto">
          {availableVehicles.length > 0 ? (
            availableVehicles.map((vehicle) => (
              <Button
                className="w-full justify-between"
                disabled={loadingVehicleId !== null}
                key={vehicle.id}
                onClick={() => attachVehicle(vehicle.id)}
                type="button"
                variant="outline"
              >
                <span>{vehicleLabel(vehicle)}</span>
                <span className="text-xs text-muted-foreground">
                  {loadingVehicleId === vehicle.id ? attaching : "→"}
                </span>
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{noAvailableVehicles}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
