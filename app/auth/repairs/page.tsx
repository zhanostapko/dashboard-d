import React from "react";
import Error from "@/components/Error";
import RepairsTable from "@/components/Repairs/RepairsTable";
import { repairService } from "@/modules/repairs/service";

const RepairsPage = async () => {
  let repairs;

  try {
    repairs = await repairService.getAllRepairs();
  } catch (error) {
    console.error("Failed to load repairs:", error);
    return <Error />;
  }

  return <RepairsTable repairs={repairs} />;
};

export default RepairsPage;
