import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteRepairButton from "@/components/Repairs/DeleteRepairButton";
import EditRepairButton from "@/components/Repairs/EditRepairButton";
import labelsData from "@/data/labels.json";
import { requirePageUser } from "@/lib/authz";
import { RepairItemDto } from "@/modules/repairs/schema";
import { repairService } from "@/modules/repairs/service";

const RepairDetailPage = async ({
  params,
}: {
  params: Promise<{ repairId: string }>;
}) => {
  await requirePageUser();

  const { repairId } = await params;
  const id = Number(repairId);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const repair = await repairService.getRepairById(id);

  if (!repair) {
    notFound();
  }

  const {
    backToRepairs,
    carPlate,
    clientName,
    date,
    detailsTitle,
    noItems,
    repairForm,
  } = labelsData.ru.repairs;
  const { carInformation, clientInformation, repairItems } = repairForm;
  const total = calculateRepairTotal(repair.items);

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/auth/repairs">{backToRepairs}</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle>
              {detailsTitle} #{repair.id}
            </CardTitle>
            <div className="flex gap-2">
              <EditRepairButton repairId={repair.id} />
              <DeleteRepairButton repairId={repair.id} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="mb-4 text-lg font-semibold">
              {clientInformation.title}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <DisplayField label={clientName} value={repair.clientName} />
              <DisplayField
                label={clientInformation.phone}
                value={repair.clientPhone}
              />
              <DisplayField
                label={date}
                value={new Date(repair.date).toLocaleDateString("en-US")}
              />
            </div>
          </section>

          <section className="border-t pt-6">
            <h2 className="mb-4 text-lg font-semibold">
              {carInformation.title}
            </h2>
            <div className="grid gap-4 md:grid-cols-4">
              <DisplayField label={carInformation.brand} value={repair.carBrand} />
              <DisplayField label={carInformation.model} value={repair.carModel} />
              <DisplayField label={carPlate} value={repair.carPlate} />
              <DisplayField
                label={carInformation.mileage}
                value={repair.carMileage}
              />
            </div>
          </section>

          <section className="border-t pt-6">
            <h2 className="mb-4 text-lg font-semibold">{repairItems.title}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left">{repairItems.name}</th>
                    <th className="px-3 py-2 text-left">{repairItems.type}</th>
                    <th className="px-3 py-2 text-left">
                      {repairItems.quantity}
                    </th>
                    <th className="px-3 py-2 text-left">{repairItems.price}</th>
                    <th className="px-3 py-2 text-left">{repairItems.sum}</th>
                  </tr>
                </thead>
                <tbody>
                  {repair.items.length > 0 ? (
                    repair.items.map((item) => (
                      <tr className="border-b" key={item.id}>
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {item.name}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {item.unit === "materials"
                            ? repairItems.materials
                            : repairItems.work}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {item.price.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="py-4 text-center text-muted-foreground"
                        colSpan={5}
                      >
                        {noItems}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex justify-end">
            <h2 className="py-2 text-2xl font-bold">
              {repairItems.sum}: {total.toFixed(2)}
            </h2>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const calculateRepairTotal = (items: RepairItemDto[]) =>
  items.reduce((sum, item) => sum + item.quantity * item.price, 0);

const DisplayField = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div>
    <p className="mb-1 text-sm font-medium">{label}</p>
    <div className="rounded border border-gray-200 bg-muted px-4 py-2 font-medium text-gray-800 shadow-sm">
      {value || "-"}
    </div>
  </div>
);

export default RepairDetailPage;
