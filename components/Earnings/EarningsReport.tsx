import { EarningsReportDto } from "@/modules/earnings/schema";
import { UserDto } from "@/modules/users/schema";
import { Labels } from "@/lib/i18n-data";

type Props = {
  report: EarningsReportDto;
  users: UserDto[];
  from?: string;
  to?: string;
  workerId?: number;
  labels: Labels;
};

export default function EarningsReport({ report, users, from = "", to = "", workerId, labels: allLabels }: Props) {
  const labels = allLabels.earnings;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">{labels.title}</h1>
      <form className="flex flex-wrap items-end gap-3" method="get">
        <label className="flex flex-col gap-1 text-sm">
          {labels.from}
          <input className="h-10 rounded-md border px-3" type="date" name="from" defaultValue={from} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {labels.to}
          <input className="h-10 rounded-md border px-3" type="date" name="to" defaultValue={to} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {labels.worker}
          <select className="h-10 rounded-md border bg-background px-3" name="workerId" defaultValue={workerId ?? ""}>
            <option value="">{labels.allWorkers}</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name} {user.surname ?? ""}</option>
            ))}
          </select>
        </label>
        <button className="h-10 rounded-md bg-primary px-4 text-primary-foreground" type="submit">{labels.show}</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded border p-4"><div className="text-sm text-muted-foreground">{labels.totalWork}</div><div className="text-2xl font-bold">{report.totalWork.toFixed(2)}</div></div>
        <div className="rounded border p-4"><div className="text-sm text-muted-foreground">{labels.totalCommission}</div><div className="text-2xl font-bold">{report.totalCommission.toFixed(2)}</div></div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">{labels.workerSummary}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead><tr className="border-b"><th className="px-3 py-2 text-left">{labels.worker}</th><th className="px-3 py-2 text-left">{labels.totalWork}</th><th className="px-3 py-2 text-left">{labels.commission}</th></tr></thead>
            <tbody>{report.workers.map((worker) => <tr className="border-b" key={worker.userId}><td className="px-3 py-2">{worker.name} {worker.surname ?? ""}</td><td className="px-3 py-2">{worker.workTotal.toFixed(2)}</td><td className="px-3 py-2">{worker.commission.toFixed(2)}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">{labels.repairDetails}</h2>
        {report.repairs.length === 0 ? <p className="text-sm text-muted-foreground">{labels.noResults}</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead><tr className="border-b"><th className="px-3 py-2 text-left">№</th><th className="px-3 py-2 text-left">{labels.closedAt}</th><th className="px-3 py-2 text-left">{allLabels.repairs.clientName}</th><th className="px-3 py-2 text-left">{labels.totalWork}</th><th className="px-3 py-2 text-left">{labels.worker}</th><th className="px-3 py-2 text-left">{labels.rate}</th><th className="px-3 py-2 text-left">{labels.commission}</th></tr></thead>
              <tbody>{report.repairs.flatMap((repair) => (repair.workers.length > 0 ? repair.workers : [null]).map((worker) => <tr className="border-b" key={`${repair.id}-${worker?.userId ?? "none"}`}><td className="px-3 py-2">{repair.id}</td><td className="px-3 py-2">{new Date(repair.closedAt).toLocaleDateString()}</td><td className="px-3 py-2">{repair.clientName || "-"}</td><td className="px-3 py-2">{repair.workTotal.toFixed(2)}</td><td className="px-3 py-2">{worker ? `${worker.name} ${worker.surname ?? ""}` : "-"}</td><td className="px-3 py-2">{worker ? `${worker.rate.toFixed(2)}%` : "-"}</td><td className="px-3 py-2">{worker ? worker.commission.toFixed(2) : "0.00"}</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
