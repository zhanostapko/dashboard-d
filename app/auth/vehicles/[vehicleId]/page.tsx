import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClickableTableRow from "@/components/General/ClickableTableRow";
import { getServerLabels } from "@/lib/i18n";
import { requirePageUser } from "@/lib/authz";
import { vehicleService } from "@/modules/vehicles/service";

const VehicleDetailPage = async ({
  params,
}: {
  params: Promise<{ vehicleId: string }>;
}) => {
  await requirePageUser();
  const data = await getServerLabels();
  const { vehicleId } = await params;
  const id = Number(vehicleId);

  if (!Number.isInteger(id)) notFound();

  const vehicle = await vehicleService.getVehicleDetailsById(id);
  if (!vehicle) notFound();

  const { backToVehicles, detailsTitle, noOwners, ownersTitle } = data.vehicles;
  const { brand, model, plate, vin } = data.repairs.repairForm.carInformation;
  const { carPlate, clientName, date, nr, open, closed, status } = data.repairs;
  const repairsTitle = data.clients.repairsTitle;

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/auth/vehicles">{backToVehicles}</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {detailsTitle}: {vehicle.brand} {vehicle.model}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <DisplayField label={brand} value={vehicle.brand} />
          <DisplayField label={model} value={vehicle.model} />
          <DisplayField label={plate} value={vehicle.plate} />
          <DisplayField label={vin} value={vehicle.vin} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{ownersTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicle.owners.length > 0 ? (
            <div className="space-y-2">
              {vehicle.owners.map((owner) => (
                <Link
                  key={owner.id}
                  href={`/auth/clients/${owner.id}`}
                  className="block border-b py-2 font-semibold hover:bg-muted/50 last:border-b-0"
                >
                  {owner.name}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{noOwners}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{repairsTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicle.repairs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left">{nr}</th>
                    <th className="px-3 py-2 text-left">{clientName}</th>
                    <th className="px-3 py-2 text-left">{carPlate}</th>
                    <th className="px-3 py-2 text-left">{date}</th>
                    <th className="px-3 py-2 text-left">{status}</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicle.repairs.map((repair) => (
                    <ClickableTableRow
                      href={`/auth/repairs/${repair.id}`}
                      key={repair.id}
                    >
                      <td className="px-3 py-2 font-medium">#{repair.id}</td>
                      <td className="px-3 py-2">{repair.clientName || "-"}</td>
                      <td className="px-3 py-2">{repair.carPlate || "-"}</td>
                      <td className="px-3 py-2">
                        {new Date(repair.date).toLocaleDateString("en-US")}
                      </td>
                      <td className="px-3 py-2">
                        {repair.status === "Closed" ? closed : open}
                      </td>
                    </ClickableTableRow>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {data.clients.noRepairs}
            </p>
          )}
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
  value: string | null | undefined;
}) => (
  <div>
    <p className="mb-1 text-sm font-medium">{label}</p>
    <div className="rounded border border-gray-200 bg-muted px-4 py-2 font-semibold text-gray-800 shadow-sm">
      {value || "-"}
    </div>
  </div>
);

export default VehicleDetailPage;
