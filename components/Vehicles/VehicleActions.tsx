"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteVehicleAction } from "@/app/actions/vehicles";
import { useLocaleData } from "@/components/General/I18nProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VehicleDto } from "@/modules/vehicles/schema";
import CreateVehicleForm from "./CreateVehicleForm";

type Props = {
  vehicle: VehicleDto;
  redirectAfterDelete?: boolean;
  iconOnly?: boolean;
};

export default function VehicleActions({
  vehicle,
  redirectAfterDelete = false,
  iconOnly = false,
}: Props) {
  const router = useRouter();
  const labels = useLocaleData().ru;
  const [editOpen, setEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteVehicle = async () => {
    if (
      !window.confirm(
        `${labels.vehicles.deleteBtn}? ${labels.vehicles.deleteDescription}`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    const result = await deleteVehicleAction(vehicle.id);

    if (!result.success) {
      setError(result.error ?? labels.errors.database);
      setIsDeleting(false);
      return;
    }

    if (redirectAfterDelete) {
      router.push("/auth/vehicles");
      return;
    }

    router.refresh();
    setIsDeleting(false);
  };

  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <Button
          type="button"
          variant={iconOnly ? "ghost" : "outline"}
          size={iconOnly ? "icon" : "default"}
          title={iconOnly ? labels.vehicles.editBtn : undefined}
          aria-label={labels.vehicles.editBtn}
          onClick={() => setEditOpen(true)}
        >
          {iconOnly ? (
            <>
              <Pencil className="size-4" />
              <span className="sr-only">{labels.vehicles.editBtn}</span>
            </>
          ) : (
            labels.vehicles.editBtn
          )}
        </Button>
        <DialogContent>
          <DialogTitle className="sr-only">{labels.vehicles.editTitle}</DialogTitle>
          <CreateVehicleForm
            vehicle={vehicle}
            onClose={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Button
        type="button"
          variant={iconOnly ? "ghost" : "destructive"}
          size={iconOnly ? "icon" : "default"}
          title={iconOnly ? labels.vehicles.deleteBtn : undefined}
        aria-label={labels.vehicles.deleteBtn}
        disabled={isDeleting}
        onClick={deleteVehicle}
      >
        {isDeleting ? (
          <span className="text-xs">{labels.vehicles.deleting}</span>
        ) : iconOnly ? (
          <Trash2 className="size-4 text-destructive" />
        ) : (
          labels.vehicles.deleteBtn
        )}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
