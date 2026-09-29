import RepairFormSection from "./RepairFormSection";
import labelsData from "@/data/labels.json";

type Props = {
  total: number;
};

export default function RepairSummarySection({ total }: Props) {
  const { sum } = labelsData.ru.repairs.repairForm.repairItems;

  return (
    <RepairFormSection title={sum}>
      <div className="flex justify-end">
        <h2 className="py-2 text-2xl font-bold">
          {sum}: {total.toFixed(2)}
        </h2>
      </div>
    </RepairFormSection>
  );
}
