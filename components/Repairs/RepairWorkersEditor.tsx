"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocaleData } from "@/components/General/I18nProvider";
import { saveRepairWorkersAction } from "@/app/actions/repairs";
import { RepairDto, RepairWorkerInput } from "@/modules/repairs/schema";
import { UserDto } from "@/modules/users/schema";

type Props = {
  repair: RepairDto;
  users: UserDto[];
  canManage: boolean;
};

export default function RepairWorkersEditor({ repair, users, canManage }: Props) {
  const labels = useLocaleData().ru;
  const [workers, setWorkers] = useState<RepairWorkerInput[]>(
    repair.workers.map(({ userId, rate }) => ({ userId, rate }))
  );
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignedIds = new Set(workers.map((worker) => worker.userId));
  const availableUsers = users.filter((user) => !assignedIds.has(user.id));

  const addWorker = () => {
    const user = users.find((candidate) => candidate.id === Number(selectedUserId));
    if (!user) return;
    setWorkers((current) => [...current, { userId: user.id, rate: user.baseRate }]);
    setSelectedUserId("");
  };

  const updateRate = (userId: number, rate: number) => {
    setWorkers((current) =>
      current.map((worker) =>
        worker.userId === userId ? { ...worker, rate } : worker
      )
    );
  };

  const save = async () => {
    setIsSaving(true);
    setError(null);
    const result = await saveRepairWorkersAction(repair.id, workers);
    setIsSaving(false);
    if (!result.success) {
      setError(result.error ?? labels.errors.database);
      return;
    }
    window.location.reload();
  };

  return (
    <section className="border-t pt-6">
      <h2 className="mb-4 text-lg font-semibold">{labels.earnings.workerSummary}</h2>
      {repair.workers.length === 0 && !canManage ? (
        <p className="text-sm text-muted-foreground">{labels.earnings.noResults}</p>
      ) : (
        <div className="space-y-3">
          {workers.map((worker) => {
            const user = users.find((candidate) => candidate.id === worker.userId);
            const existing = repair.workers.find((candidate) => candidate.userId === worker.userId);
            return (
              <div className="flex flex-wrap items-center gap-3 rounded border p-3" key={worker.userId}>
                <span className="min-w-48 font-medium">
                  {user ? `${user.name} ${user.surname ?? ""}`.trim() : existing?.name}
                </span>
                <label className="flex items-center gap-2 text-sm">
                  {labels.earnings.rate}
                  <Input
                    className="w-24"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={worker.rate}
                    disabled={!canManage || isSaving}
                    onChange={(event) => updateRate(worker.userId, Number(event.target.value))}
                  />
                  %
                </label>
                <span className="text-sm text-muted-foreground">
                  {labels.earnings.commission}: {existing?.commission.toFixed(2) ?? "0.00"}
                </span>
                {canManage && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSaving}
                    onClick={() => setWorkers((current) => current.filter((item) => item.userId !== worker.userId))}
                  >
                    {labels.common.close}
                  </Button>
                )}
              </div>
            );
          })}
          {canManage && (
            <div className="flex flex-wrap gap-2">
              <select
                className="h-10 rounded-md border bg-background px-3 text-sm"
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
                disabled={isSaving || availableUsers.length === 0}
              >
                <option value="">{labels.earnings.worker}</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.surname ?? ""} ({user.baseRate}%)
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" onClick={addWorker} disabled={!selectedUserId || isSaving}>
                {labels.earnings.worker}
              </Button>
              <Button type="button" onClick={save} disabled={isSaving}>
                {isSaving ? labels.earnings.loading : labels.common.saved}
              </Button>
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </section>
  );
}
