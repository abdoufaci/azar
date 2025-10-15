import { getProductSubTypes } from "@/actions/queries/products/get-product-sub-types";
import { getProductVariants } from "@/actions/queries/products/get-product-variants";
import { getProducts } from "@/actions/queries/products/get-products";
import { getTissues } from "@/actions/queries/products/get-tissues";
import ProductionInterface from "./_components/production-interface";
import { getEmployeesAndClients } from "@/actions/queries/users/get-employees-clients";
import { getWorkshops } from "@/actions/queries/workshop/get-workshops";
import { getProductions } from "@/actions/queries/order/get-productions";
import { getOrderStages } from "@/actions/queries/order/get-order-stages";
import { getProductionsCount } from "@/actions/queries/order/get-productions-count";

export default async function ProductionPage({
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const currentPage = (await searchParams).page;
  const productionsPerPage = 8;
  const types = await getProductSubTypes();
  const variants = await getProductVariants();
  const tissues = await getTissues();
  const { clients, employees } = await getEmployeesAndClients();
  const workshops = await getWorkshops();
  const productions = await getProductions(
    Number(currentPage || "1"),
    productionsPerPage,
    searchParams
  );
  const totalProductions = await getProductionsCount(searchParams);
  const orderStages = await getOrderStages();

  return (
    <div className="p-8">
      <ProductionInterface
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
        productionsPerPage={productionsPerPage}
        totalProductions={totalProductions}
      />
    </div>
  );
}
