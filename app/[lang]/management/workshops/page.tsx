import WorkshopCard from "./_components/workshop-card";
import { AddWorkshopButton } from "./_components/add-workshop-button";
import { getWorkshops } from "@/actions/queries/workshop/get-workshops";
import { getEmployeesAndClients } from "@/actions/queries/users/get-employees-clients";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ateliers",
  description: "A platform for managing forniture",
  icons: {
    icon: "/icon.png",
    href: "/icon.png",
  },
};

export default async function WorkShopsPage() {
  const workshops = await getWorkshops(true);
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
          <Link href={`/management/workshop/${item?.id}`} key={item.id}>
            <WorkshopCard
              //@ts-ignore
              workshop={item}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
