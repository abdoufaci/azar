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

interface Props {
  params: { lang: string; workshopId: string };
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function WorkShopIdPage({
  params: { lang, workshopId },
  searchParams,
}: Props) {
  const [
    types,
    variants,
    tissues,
    users,
    workshops,
    orderStages,
    workshop,
    stages,
    materials,
    columns,
  ] = await Promise.all([
    getProductSubTypes(),
    getProductVariants(),
    getTissues(),
    getEmployeesAndClients(),
    getWorkshops(),
    getOrderStages(),
    getWorkShopById(workshopId),
    getDemandStages(),
    getDemandMaterials(),
    getColumns(),
  ]);
  const { clients, employees } = users;

  return (
    <div className="min-h-screen p-6 space-y-6">
      <WorkshopInterface
        searchParams={await searchParams}
        types={types}
        variants={variants}
        tissues={tissues}
        clients={clients}
        employees={employees}
        workShops={workshops}
        orderStages={orderStages}
        stages={stages}
        workshop={workshop}
        materials={materials}
        url={`/management/workshop/${workshopId}`}
        columns={columns}
      />
    </div>
  );
}

export default WorkShopIdPage;
