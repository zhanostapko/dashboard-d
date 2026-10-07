import React from "react";
import Error from "@/components/Error";
import RepairsTable from "@/components/Repairs/RepairsTable";
import { getServerLabels } from "@/lib/i18n";
import { requirePageUser } from "@/lib/authz";
import { repairService } from "@/modules/repairs/service";

const RepairsPage = async () => {
  const currentUser = await requirePageUser();
  const labels = await getServerLabels();

  try {
    const repairs = await repairService.getAllRepairs();
    const isAdmin = currentUser.role === "ADMIN";

    return (
      <RepairsTable
        repairs={repairs}
        canManagePayment
        canReopen={isAdmin}
      />
    );
  } catch (error) {
    console.error("Failed to load repairs:", error);
    return (
      <div className="p-6">
        <p className="mb-4 text-red-500">{labels.repairs.error}</p>
        <Error />
      </div>
    );
  }
};

export default RepairsPage;
