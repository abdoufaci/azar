import WorkshopCard from "./_components/workshop-card";
import { AddWorkshopButton } from "./_components/add-workshop-button";
import { getWorkshops } from "@/actions/queries/workshop/get-workshops";
import { getEmployeesAndClients } from "@/actions/queries/users/get-employees-clients";

export default async function WorkShopsPage() {
  const workshops = await getWorkshops();
  const { employees } = await getEmployeesAndClients();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          L&apos;ateliers
        </h1>
        <AddWorkshopButton data={{ employees }} />
      </div>

      <div className="flex items-center flex-wrap gap-6">
        {workshops.map((item) => (
          <WorkshopCard key={item.id} workshop={item} />
        ))}
      </div>
    </div>
  );
}
