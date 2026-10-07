import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AttachVehicleToClient from "@/components/Clients/AttachVehicleToClient";
import DetachVehicleFromClientButton from "@/components/Clients/DetachVehicleFromClientButton";
import ClientDetailsCard from "@/components/Clients/ClientDetailsCard";
import ClickableTableRow from "@/components/General/ClickableTableRow";
import { getServerLabels } from "@/lib/i18n";
import { requirePageUser } from "@/lib/authz";
import { clientService } from "@/modules/clients/service";
import { repairService } from "@/modules/repairs/service";
import { vehicleService } from "@/modules/vehicles/service";

const ClientDetailPage = async ({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) => {
  await requirePageUser();
  const data = await getServerLabels();
  const { clientId } = await params;
  const id = Number(clientId);

  if (!Number.isInteger(id)) notFound();

  const [client, allVehicles, repairs] = await Promise.all([
    clientService.getClientById(id),
    vehicleService.getAllVehicles(),
    repairService.getRepairsByClientId(id),
  ]);

  if (!client) notFound();

  const {
    backToClients,
    noRepairs,
    noVehicles,
    repairsTitle,
    vehiclesTitle,
    actions,
  } = data.clients;
  const { brand, model, plate, vin } = data.repairs.repairForm.carInformation;
  const { carPlate, date, nr, open, closed, status } = data.repairs;

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/auth/clients">{backToClients}</Link>
        </Button>
      </div>

      <ClientDetailsCard client={client} />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>{vehiclesTitle}</CardTitle>
            {allVehicles.length > (client.vehicles?.length ?? 0) && (
              <AttachVehicleToClient
                attachedVehicleIds={(client.vehicles ?? []).map(
                  (vehicle) => vehicle.id
                )}
                clientId={client.id}
                vehicles={allVehicles}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {client.vehicles && client.vehicles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left">{brand}</th>
                    <th className="px-3 py-2 text-left">{model}</th>
                    <th className="px-3 py-2 text-left">{plate}</th>
                    <th className="px-3 py-2 text-left">{vin}</th>
                    <th className="px-3 py-2 text-right">{actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {client.vehicles.map((vehicle) => (
                    <ClickableTableRow
                      href={`/auth/vehicles/${vehicle.id}`}
                      key={vehicle.id}
                    >
                      <td className="px-3 py-2 font-medium">{vehicle.brand}</td>
                      <td className="px-3 py-2">{vehicle.model}</td>
                      <td className="px-3 py-2">{vehicle.plate || "-"}</td>
                      <td className="px-3 py-2">{vehicle.vin || "-"}</td>
                      <td className="px-3 py-2 text-right">
                        <DetachVehicleFromClientButton
                          clientId={client.id}
                          vehicleId={vehicle.id}
                        />
                      </td>
                    </ClickableTableRow>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{noVehicles}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{repairsTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {repairs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left">{nr}</th>
                    <th className="px-3 py-2 text-left">{carPlate}</th>
                    <th className="px-3 py-2 text-left">{date}</th>
                    <th className="px-3 py-2 text-left">{status}</th>
                  </tr>
                </thead>
                <tbody>
                  {repairs.map((repair) => (
                    <ClickableTableRow
                      href={`/auth/repairs/${repair.id}`}
                      key={repair.id}
                    >
                      <td className="px-3 py-2 font-medium">#{repair.id}</td>
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
            <p className="text-sm text-muted-foreground">{noRepairs}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDetailPage;
