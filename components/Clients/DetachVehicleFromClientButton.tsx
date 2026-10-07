"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { detachVehicleFromClientAction } from "@/app/actions/vehicles";
import ConfirmActionDialog from "@/components/General/ConfirmActionDialog";
import { useLocaleData } from "@/components/General/I18nProvider";
import { Button } from "@/components/ui/button";

type Props = {
  clientId: number;
  vehicleId: number;
};

export default function DetachVehicleFromClientButton({
  clientId,
  vehicleId,
}: Props) {
  const router = useRouter();
  const labels = useLocaleData().ru;
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detachVehicle = async () => {
    setIsPending(true);
    setError(null);
    const result = await detachVehicleFromClientAction(vehicleId, clientId);

    if (!result.success) {
      setError(result.error ?? labels.errors.database);
      setIsPending(false);
      return;
    }

    setOpen(false);
    setIsPending(false);
    router.refresh();
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
      >
        {labels.clients.detachVehicle}
      </Button>
      <ConfirmActionDialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setError(null);
        }}
        title={labels.clients.detachVehicle}
        description={labels.clients.detachVehicleDescription}
        cancelLabel={labels.invoices.invoiceForm.invoiceItems.cancelEdit}
        confirmLabel={isPending ? labels.clients.detaching : labels.clients.detachVehicle}
        isPending={isPending}
        error={error}
        destructive
        onConfirm={detachVehicle}
      />
    </>
  );
}
