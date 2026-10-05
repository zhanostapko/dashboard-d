"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocaleData } from "@/components/General/I18nProvider";
import { ClientDto } from "@/modules/clients/schema";
import CreateClientForm from "./CreateClientForm/CreateClientForm";

type Props = {
  client: ClientDto;
};

const ClientDetailsCard = ({ client }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const data = useLocaleData();
  const labels = data.ru.clients;
  const cancelLabel = data.ru.invoices.invoiceForm.invoiceItems.cancelEdit;

  if (isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <CreateClientForm
            selectedClient={client}
            onCancel={() => setIsEditing(false)}
            onClose={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>{labels.infoTitle}</CardTitle>
        <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
          {labels.editClientBtn}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <DisplayField label={labels.name} value={client.name} />
        <DisplayField label={labels.regNr} value={client.regNr} />
        <DisplayField label={labels.phone} value={client.phone} />
        <DisplayField label={labels.email} value={client.email} />
        <DisplayField label={labels.address} value={client.address} />
        <DisplayField label={labels.bank} value={client.bank} />
        <DisplayField label={labels.bankCode} value={client.bankCode} />
        <DisplayField label={labels.account} value={client.account} />
      </CardContent>
    </Card>
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
    <p className="font-semibold text-gray-800">{value || "-"}</p>
  </div>
);

export default ClientDetailsCard;
