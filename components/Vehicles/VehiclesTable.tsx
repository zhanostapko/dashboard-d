"use client";

import { useState } from "react";
import ModalWrapper from "@/components/General/ModalWrapper";
import { useLocaleData } from "@/components/General/I18nProvider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VehicleDto } from "@/modules/vehicles/schema";
import CreateVehicleForm from "./CreateVehicleForm";

type Props = {
  vehicles: VehicleDto[];
};

export default function VehiclesTable({ vehicles }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const data = useLocaleData();
  const { brand, model, plate, vin } = data.ru.repairs.repairForm.carInformation;

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalContent={<CreateVehicleForm onClose={() => setIsOpen(false)} />}
      />
      <Button onClick={() => setIsOpen(true)} className="mb-4">
        + {data.ru.vehicles.addBtn}
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{brand}</TableHead>
            <TableHead>{model}</TableHead>
            <TableHead>{plate}</TableHead>
            <TableHead>{vin}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                {data.ru.vehicles.noVehicles}
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.brand}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.plate || "-"}</TableCell>
                <TableCell>{vehicle.vin || "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
