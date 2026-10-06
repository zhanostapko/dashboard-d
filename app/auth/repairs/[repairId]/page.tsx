import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteRepairButton from "@/components/Repairs/DeleteRepairButton";
import EditRepairButton from "@/components/Repairs/EditRepairButton";
import CloseRepairButton from "@/components/Repairs/CloseRepairButton";
import ReopenRepairButton from "@/components/Repairs/ReopenRepairButton";
import RepairPaymentButton from "@/components/Repairs/RepairPaymentButton";
import RepairWorkersEditor from "@/components/Repairs/RepairWorkersEditor";
import { getServerLabels } from "@/lib/i18n";
import { requirePageUser } from "@/lib/authz";
import { userService } from "@/modules/users/service";
import { RepairItemDto } from "@/modules/repairs/schema";
import { repairService } from "@/modules/repairs/service";

const RepairDetailPage = async ({
  params,
}: {
  params: Promise<{ repairId: string }>;
}) => {
  const currentUser = await requirePageUser();
  const labelsData = await getServerLabels();

  const { repairId } = await params;
  const id = Number(repairId);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const repair = await repairService.getRepairById(id);

  if (!repair) {
    notFound();
  }

  const users = currentUser.role === "ADMIN" ? await userService.getAllUsers() : [];

  const {
    backToRepairs,
    carPlate,
    clientName,
    date,
    detailsTitle,
    noItems,
    repairForm,
    status,
    open,
    closed,
    createInvoiceBtn,
    invoiceAttached,
  } = labelsData.repairs;
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
            <div className="flex flex-wrap justify-end gap-2">
              {repair.status === "Open" && (
                <>
                  {!repair.invoiceId && (
                    <Button asChild variant="outline">
                      <Link href={`/auth/invoices/new?repairId=${repair.id}`}>
                        {createInvoiceBtn}
                      </Link>
                    </Button>
                  )}
                  <CloseRepairButton repairId={repair.id} />
                  <EditRepairButton repairId={repair.id} />
                  {!repair.invoiceId && <DeleteRepairButton repairId={repair.id} />}
                </>
              )}
              {repair.status === "Closed" && (
                <ReopenRepairButton repairId={repair.id} />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="mb-4 text-lg font-semibold">
              {clientInformation.title}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <DisplayField
                label={clientName}
                value={repair.clientName}
                plain
                linkHref={
                  repair.clientId
                    ? `/auth/clients/${repair.clientId}`
                    : undefined
                }
              />
              <DisplayField
                label={status}
                value={repair.status === "Closed" ? closed : open}
              />
              <DisplayField
                label={labelsData.invoices.status}
                value={
                  repair.paymentStatus === "Paid"
                    ? labelsData.invoices.paid
                    : labelsData.invoices.unpaid
                }
              />
              <DisplayField
                label={clientInformation.phone}
                value={repair.clientPhone}
              />
              <DisplayField
                label={date}
                value={new Date(repair.date).toLocaleDateString("en-US")}
              />
              <DisplayField
                label={labelsData.earnings.closedAt}
                value={repair.closedAt ? new Date(repair.closedAt).toLocaleDateString("en-US") : "-"}
              />
              <DisplayField
                label={labelsData.invoices.paid}
                value={repair.paidAt ? new Date(repair.paidAt).toLocaleDateString("en-US") : "-"}
              />
            </div>
            {repair.invoiceId && (
              <div className="mt-4">
                <Button asChild variant="link" className="h-auto p-0">
                  <Link href={`/auth/invoices/${repair.invoiceId}`}>
                    {invoiceAttached}: #{repair.invoiceId}
                  </Link>
                </Button>
              </div>
            )}
            {currentUser.role === "ADMIN" && repair.paymentStatus === "Unpaid" && (
              <div className="mt-4">
                <RepairPaymentButton repairId={repair.id} />
              </div>
            )}
          </section>

          <RepairWorkersEditor
            repair={repair}
            users={users}
            canManage={currentUser.role === "ADMIN"}
          />

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
  linkHref,
  plain = false,
}: {
  label: string;
  value: string | number | null | undefined;
  linkHref?: string;
  plain?: boolean;
}) => (
  <div>
    <p className="mb-1 text-sm font-medium">{label}</p>
    <div
      className={
        plain
          ? "py-2 font-semibold text-gray-800"
          : "rounded border border-gray-200 bg-muted px-4 py-2 font-semibold text-gray-800 shadow-sm"
      }
    >
      {linkHref && value ? (
        <Link href={linkHref} className="hover:underline">
          {value}
        </Link>
      ) : (
        value || "-"
      )}
    </div>
  </div>
);

export default RepairDetailPage;
