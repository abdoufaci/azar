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

interface Props {
  params: { lang: string; workshopId: string };
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function WorkShopIdPage({
  params: { lang, workshopId },
  searchParams,
}: Props) {
  const currentPage = (await searchParams).page;
  const target = (await searchParams).target;
  const itemsPerPage = 8;
  const types = await getProductSubTypes();
  const variants = await getProductVariants();
  const tissues = await getTissues();
  const { clients, employees } = await getEmployeesAndClients();
  const workshops = await getWorkshops();
  const productions = await getProductions({
    currentPage: Number(currentPage || "1"),
    productionsPerPage: itemsPerPage,
    searchParams,
    workshopId,
  });
  const totalProductions = await getProductionsCount({
    searchParams,
    workshopId,
  });
  const orderStages = await getOrderStages();
  const workshop = await getWorkShopById(workshopId);
  const demands = await getDemands({
    currentPage: Number(currentPage || "1"),
    demandsPerPage: itemsPerPage,
    searchParams,
    workshopId,
  });
  const totalDemands = await getDemandsCount({ searchParams, workshopId });
  const stages = await getDemandStages();
  const materials = await getDemandMaterials();

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
        //@ts-ignore
        productions={productions}
        orderStages={orderStages}
        currentPage={Number(currentPage || "1")}
        productionsPerPage={itemsPerPage}
        totalProductions={totalProductions}
        demands={demands}
        stages={stages}
        totalDemands={totalDemands}
        workshop={workshop}
        materials={materials}
        itemsPerPage={itemsPerPage}
        url={`/management/workshop/${workshopId}`}
      />
    </div>
  );
}

export default WorkShopIdPage;
