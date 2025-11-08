import { getOrderStages } from "@/actions/queries/order/get-order-stages";
import { getProductions } from "@/actions/queries/order/get-productions";
import { getProductionsCount } from "@/actions/queries/order/get-productions-count";
import { getProductSubTypes } from "@/actions/queries/products/get-product-sub-types";
import { getProductVariants } from "@/actions/queries/products/get-product-variants";
import { getTissues } from "@/actions/queries/products/get-tissues";
import { getEmployeesAndClients } from "@/actions/queries/users/get-employees-clients";
import { getWorkshops } from "@/actions/queries/workshop/get-workshops";
import { WorkShopSwitch } from "./_components/workshop-switch";
import { getWorkShopById } from "@/actions/queries/workshop/get-workshop-by-id";
import ProductionInterface from "../../production/_components/production-interface";
import { getDemands } from "@/actions/queries/demands/get-demands";
import { getDemandsCount } from "@/actions/queries/demands/get-demands-count";
import { getDemandStages } from "@/actions/queries/demands/get-demand-stages";
import { getDemandMaterials } from "@/actions/queries/demands/get-demand-materials";
import DemandsInterface from "../../demands/_components/demands-interface";
import WorkshopInterface from "./_components/workshop-interface";
import { getColumns } from "@/actions/queries/order/get-columns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atelier",
  description: "A platform for managing forniture",
  icons: {
    icon: "/icon.png",
    href: "/icon.png",
  },
};

interface Props {
  params: { lang: string; workshopId: string };
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function WorkShopIdPage({
  params: { lang, workshopId },
  searchParams,
}: Props) {
  const [workshops, orderStages, workshop, stages, materials] =
    await Promise.all([
      getWorkshops(),
      getOrderStages(),
      getWorkShopById(workshopId),
      getDemandStages(),
      getDemandMaterials(),
    ]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <WorkshopInterface
        searchParams={await searchParams}
        workShops={workshops}
        orderStages={orderStages}
        stages={stages}
        workshop={workshop}
        materials={materials}
        url={`/management/workshop/${workshopId}`}
        columns={[]}
      />
    </div>
  );
}

export default WorkShopIdPage;
