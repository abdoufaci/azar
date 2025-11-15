import { getWorkshops } from "@/actions/queries/workshop/get-workshops";
import { getDemands } from "@/actions/queries/demands/get-demands";
import { getDemandsCount } from "@/actions/queries/demands/get-demands-count";
import { getDemandStages } from "@/actions/queries/demands/get-demand-stages";
import DemandsInterface from "./_components/demands-interface";
import { getDemandMaterials } from "@/actions/queries/demands/get-demand-materials";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demandes",
  description: "A platform for managing forniture",
  icons: {
    icon: "/icon.png",
    href: "/icon.png",
  },
};

export default async function DemandesPage({
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const [stages] = await Promise.all([getDemandStages()]);

  return (
    <div className="p-8">
      <DemandsInterface searchParams={await searchParams} stages={stages} />
    </div>
  );
}
