import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import data from "@/data/labels.json";
import AttachVehicleToClient from "@/components/Clients/AttachVehicleToClient";
import { requirePageUser } from "@/lib/authz";
import { clientService } from "@/modules/clients/service";
import { vehicleService } from "@/modules/vehicles/service";

const ClientDetailPage = async ({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) => {
  await requirePageUser();

  const { clientId } = await params;
  const id = Number(clientId);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const [client, allVehicles] = await Promise.all([
    clientService.getClientById(id),
    vehicleService.getAllVehicles(),
  ]);

  if (!client) {
    notFound();
  }

  const {
    account,
    address,
    bank,
    bankCode,
    backToClients,
    detailsTitle,
    email,
    infoTitle,
    name,
    noVehicles,
    phone,
    regNr,
    vehiclesTitle,
  } = data.ru.clients;
  const { brand, model, plate, vin } = data.ru.repairs.repairForm.carInformation;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/auth/clients">{backToClients}</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {detailsTitle}: {client.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="mb-4 text-lg font-semibold">{infoTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <DisplayField label={name} value={client.name} />
              <DisplayField label={regNr} value={client.regNr} />
              <DisplayField label={phone} value={client.phone} />
              <DisplayField label={email} value={client.email} />
              <DisplayField label={address} value={client.address} />
            </div>
          </section>

          <section className="border-t pt-6">
            <h2 className="mb-4 text-lg font-semibold">{bank}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <DisplayField label={bank} value={client.bank} />
              <DisplayField label={bankCode} value={client.bankCode} />
              <DisplayField label={account} value={client.account} />
            </div>
          </section>

          <section className="border-t pt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{vehiclesTitle}</h2>
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
            {client.vehicles && client.vehicles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-3 py-2 text-left">{brand}</th>
                      <th className="px-3 py-2 text-left">{model}</th>
                      <th className="px-3 py-2 text-left">{plate}</th>
                      <th className="px-3 py-2 text-left">{vin}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.vehicles.map((vehicle) => (
                      <tr className="border-b" key={vehicle.id}>
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {vehicle.brand}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {vehicle.model}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {vehicle.plate || "-"}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {vehicle.vin || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{noVehicles}</p>
            )}
          </section>
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
    <div className="rounded border border-gray-200 bg-muted px-4 py-2 font-medium text-gray-800 shadow-sm">
      {value || "-"}
    </div>
  </div>
);

export default ClientDetailPage;
