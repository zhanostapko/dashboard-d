import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Error from "@/components/Error";
import EditRepairButton from "@/components/Repairs/EditRepairButton";
import DeleteRepairButton from "@/components/Repairs/DeleteRepairButton";
import data from "@/data/labels.json";
import { repairService } from "@/modules/repairs/service";

const { repairs } = data.ru;
const { date, notFound, repairNumber, repairForm, backToRepairs } = repairs;
const { clientInformation, carInformation, repairItems } = repairForm;
const { title, clientName, phone } = clientInformation;
const { title: carTitle, brand, model, plate, mileage } = carInformation;
const {
  title: repairItemsTitle,
  name,
  type,
  quantity,
  price,
  work,
  materials,
} = repairItems;

const RepairDetailPage = async ({
  params,
}: {
  params: Promise<{ repairId: string }>;
}) => {
  let repair;
  const { repairId } = await params;

  try {
    repair = await repairService.getRepairById(Number(repairId));
  } catch (error) {
    console.error(error);
    return <Error />;
  }

  if (!repair) {
    return <div className="text-center text-2xl font-semibold">{notFound}</div>;
  }

  const total = repair.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/auth/repairs">{backToRepairs}</Link>
        </Button>
      </div>
      <Card className="p-6">
        <CardContent className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-1">
              {repairNumber} {repair.id}
            </h2>
            <div className="flex gap-2 justify-between">
              <EditRepairButton repairId={repair.id} />
              <DeleteRepairButton repairId={repair.id} />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-sm mb-1">{date}*</label>
            <div className="flex items-center border rounded-md px-3 py-2 min-w-[250px] bg-white shadow-sm">
              <span className="text-gray-800 font-medium">
                {format(new Date(repair.date), "MM/dd/yyyy")}
              </span>
              <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DisplayField label={`${clientName}*`} value={repair.clientName} />
            <DisplayField label={phone} value={repair.clientPhone} />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">{carTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DisplayField label={`${brand}*`} value={repair.carBrand} />
            <DisplayField label={`${model}*`} value={repair.carModel} />
            <DisplayField label={`${plate}*`} value={repair.carPlate} />
            <DisplayField label={mileage} value={repair.carMileage} />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">{repairItemsTitle}*</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">{name}</th>
                  <th className="text-left py-2 px-3">{type}</th>
                  <th className="text-left py-2 px-3">{quantity}</th>
                  <th className="text-left py-2 px-3">{price}</th>
                </tr>
              </thead>
              <tbody>
                {repair.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 px-3 text-gray-800 font-medium">
                      {item.name}
                    </td>
                    <td className="py-2 px-3 text-gray-800 font-medium">
                      {item.unit === "materials" ? materials : work}
                    </td>
                    <td className="py-2 px-3 text-gray-800 font-medium">
                      {item.quantity}
                    </td>
                    <td className="py-2 px-3 text-gray-800 font-medium">
                      {item.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <h2 className="font-bold text-2xl py-2">{`${data.ru.invoices.total}: ${total}`}</h2>
        </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DisplayField = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div>
    <p className="text-sm font-medium mb-1">{label}</p>
    <div className="bg-muted px-4 py-2 rounded shadow-sm text-gray-800 font-medium border border-gray-200">
      {value || "-"}
    </div>
  </div>
);

export default RepairDetailPage;
