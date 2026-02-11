import React from "react";
import RepairsTable from "@/components/Repairs/RepairsTable";
import data from "@/data/labels.json";
import { repairService } from "@/modules/repairs/service";

const RepairsPage = async () => {
  let repairs;

  try {
    repairs = await repairService.getAllRepairs();
  } catch (error) {
    console.error("Failed to load repairs:", error);
    return <p className="text-red-500">{data.ru.repairs.error}</p>;
  }

  return <RepairsTable repairs={repairs} />;
};

export default RepairsPage;
