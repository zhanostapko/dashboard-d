import { getServerLabels } from "@/lib/i18n";
import { requirePageUser } from "@/lib/authz";
import { vehicleService } from "@/modules/vehicles/service";
import VehiclesTable from "@/components/Vehicles/VehiclesTable";

const VehiclesPage = async () => {
  await requirePageUser();
  const [labels, vehicles] = await Promise.all([
    getServerLabels(),
    vehicleService.getAllVehicles(),
  ]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{labels.menu.vehicles}</h1>
      <VehiclesTable vehicles={vehicles} />
    </section>
  );
};

export default VehiclesPage;
