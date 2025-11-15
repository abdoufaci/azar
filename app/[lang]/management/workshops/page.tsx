import { AddWorkshopButton } from "./_components/add-workshop-button";
import { Metadata } from "next";
import WorkshopFeed from "./_components/workshop-feed";

export const metadata: Metadata = {
  title: "Ateliers",
  description: "A platform for managing forniture",
  icons: {
    icon: "/icon.png",
    href: "/icon.png",
  },
};

export default function WorkShopsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          L&apos;ateliers
        </h1>
        <AddWorkshopButton />
      </div>

      <WorkshopFeed />
    </div>
  );
}
