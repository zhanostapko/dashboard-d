import { Role } from "@prisma/client";
import { requirePageRole } from "@/lib/authz";
import { earningsFilterSchema } from "@/modules/earnings/schema";
import { earningsService } from "@/modules/earnings/service";
import { userService } from "@/modules/users/service";
import EarningsReport from "@/components/Earnings/EarningsReport";
import { getServerLabels } from "@/lib/i18n";

export default async function EarningsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; workerId?: string }>;
}) {
  await requirePageRole(Role.ADMIN);
  const labels = await getServerLabels();
  const params = await searchParams;
  const parsed = earningsFilterSchema.safeParse({
    from: params.from || undefined,
    to: params.to || undefined,
    workerId: params.workerId ? Number(params.workerId) : undefined,
  });
  const filters = parsed.success ? parsed.data : {};
  const [report, users] = await Promise.all([
    earningsService.getReport(filters),
    userService.getAllUsers(),
  ]);

  return <EarningsReport report={report} users={users} from={filters.from} to={filters.to} workerId={filters.workerId} labels={labels} />;
}
