"use client";

import { useEffect, useState } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [workers, setWorkers] = useState<RepairWorkerInput[]>(() =>
    repair.workers.map(({ userId, rate }) => ({ userId, rate })),
  );
  const [selectedUserId, setSelectedUserId] = useState("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [draftRate, setDraftRate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setWorkers(repair.workers.map(({ userId, rate }) => ({ userId, rate })));
  }, [repair.workers]);

  const assignedIds = new Set(workers.map((worker) => worker.userId));
  const availableUsers = users.filter((user) => !assignedIds.has(user.id));

  const persistWorkers = async (nextWorkers: RepairWorkerInput[]) => {
    setIsSaving(true);
    setError(null);
    const result = await saveRepairWorkersAction(repair.id, nextWorkers);
    setIsSaving(false);

    if (!result.success) {
      setError(result.error ?? labels.errors.database);
      return false;
    }

    setWorkers(nextWorkers);
    router.refresh();
    return true;
  };

  const addWorker = async () => {
    const user = users.find((candidate) => candidate.id === Number(selectedUserId));
    if (!user) return;

    const nextWorkers = [...workers, { userId: user.id, rate: user.baseRate }];
    if (await persistWorkers(nextWorkers)) {
      setSelectedUserId("");
    }
  };

  const startEditing = (worker: RepairWorkerInput) => {
    setError(null);
    setEditingUserId(worker.userId);
    setDraftRate(String(worker.rate));
  };

  const saveRate = async (worker: RepairWorkerInput) => {
    const normalizedRate = draftRate.trim();
    const rate = Number(normalizedRate);

    if (!normalizedRate || !Number.isFinite(rate) || rate < 0 || rate > 100) {
      setError(labels.errors.validation);
      return;
    }

    const nextWorkers = workers.map((currentWorker) =>
      currentWorker.userId === worker.userId ? { ...currentWorker, rate } : currentWorker,
    );

    if (await persistWorkers(nextWorkers)) {
      setEditingUserId(null);
      setDraftRate("");
    }
  };

  const removeWorker = async (userId: number) => {
    const nextWorkers = workers.filter((worker) => worker.userId !== userId);
    if (await persistWorkers(nextWorkers)) {
      setEditingUserId(null);
      setDraftRate("");
    }
  };

  return (
    <section className="border-t pt-6">
      <h2 className="mb-4 text-lg font-semibold">{labels.earnings.workerSummary}</h2>
      {repair.workers.length === 0 && !canManage ? (
        <p className="text-sm text-muted-foreground">{labels.earnings.noWorkersAssigned}</p>
      ) : (
        <div className="space-y-3">
          {workers.map((worker) => {
            const user = users.find((candidate) => candidate.id === worker.userId);
            const existing = repair.workers.find((candidate) => candidate.userId === worker.userId);
            const isEditing = editingUserId === worker.userId;

            return (
              <div className="flex flex-wrap items-center gap-3 rounded border p-3" key={worker.userId}>
                <span className="min-w-48 font-medium">
                  {user ? `${user.name} ${user.surname ?? ""}`.trim() : existing?.name}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  {labels.earnings.rate}
                  {isEditing ? (
                    <>
                      <Input
                        className="w-24"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={draftRate}
                        disabled={isSaving}
                        onChange={(event) => setDraftRate(event.target.value)}
                      />
                      <span>%</span>
                    </>
                  ) : (
                    <span className="font-medium">{worker.rate}%</span>
                  )}
                </span>
                <span className="text-sm text-muted-foreground">
                  {labels.earnings.commission}: {existing?.commission.toFixed(2) ?? "0.00"}
                </span>
                {canManage && (
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title={isEditing ? labels.common.saved : labels.earnings.rate}
                      aria-label={isEditing ? labels.common.saved : labels.earnings.rate}
                      disabled={isSaving}
                      onClick={() => (isEditing ? saveRate(worker) : startEditing(worker))}
                    >
                      {isEditing ? <Save className="size-4" /> : <Pencil className="size-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title={labels.common.close}
                      aria-label={labels.common.close}
                      disabled={isSaving}
                      onClick={() => removeWorker(worker.userId)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
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
                <option value="">{labels.earnings.selectWorker}</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.surname ?? ""} ({user.baseRate}%)
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" onClick={addWorker} disabled={!selectedUserId || isSaving}>
                {labels.earnings.addWorker}
              </Button>
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </section>
  );
}
