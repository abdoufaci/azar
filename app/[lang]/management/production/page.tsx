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
import { getColumns } from "@/actions/queries/order/get-columns";

export default async function ProductionPage({
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const [types, variants, tissues, users, workshops, orderStages, columns] =
    await Promise.all([
      getProductSubTypes(),
      getProductVariants(),
      getTissues(),
      getEmployeesAndClients(),
      getWorkshops(),
      getOrderStages(),
      getColumns(),
    ]);
  const { clients, employees } = users;

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
        orderStages={orderStages}
        columns={columns}
      />
    </div>
  );
}
