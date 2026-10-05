"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalWrapper from "@/components/General/ModalWrapper";
import { useLocaleData } from "@/components/General/I18nProvider";
import TableSearch from "@/components/General/TableSearch";
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
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const data = useLocaleData();
  const { brand, model, plate, vin } = data.ru.repairs.repairForm.carInformation;
  const { clearSearch, noResults, search } = data.ru.common;
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
  const filteredVehicles = vehicles.filter((vehicle) =>
    [vehicle.brand, vehicle.model, vehicle.plate, vehicle.vin]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedSearch)
  );

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
      <TableSearch
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={search}
        clearLabel={clearSearch}
      />
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
          {filteredVehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                {searchTerm ? noResults : data.ru.vehicles.noVehicles}
              </TableCell>
            </TableRow>
          ) : (
            filteredVehicles.map((vehicle) => (
              <TableRow
                key={vehicle.id}
                className="cursor-pointer"
                onClick={() => router.push(`/auth/vehicles/${vehicle.id}`)}
              >
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
