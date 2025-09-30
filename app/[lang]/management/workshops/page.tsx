import WorkshopCard from "./_components/workshop-card";
import { AddWorkshopButton } from "./_components/add-workshop-button";
import { WorkShop } from "@prisma/client";
import { getWorkshops } from "@/actions/queries/workshop/get-workshops";

export default async function WorkShopsPage() {
  const workshops = await getWorkshops();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">L'ateliers</h1>
        <AddWorkshopButton />
      </div>

      <div className="flex items-center flex-wrap gap-6">
        {workshops.map((item) => (
          <WorkshopCard key={item.id} workshop={item} />
        ))}
      </div>
    </div>
  );
}
