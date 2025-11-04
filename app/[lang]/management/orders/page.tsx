import SearchFilter from "@/components/filters/search-filter";
import WorkShopFilter from "@/components/filters/workshop-filter";
import TypeFilter from "@/components/filters/type-filter";
import PriorityFilter from "@/components/filters/priority-filter";
import StatusFilter from "@/components/filters/status-filter";
import { OpenDialogButton } from "@/components/open-dialog-button";
import { OrdersTable } from "./_components/orders-table";
import { getOrders } from "@/actions/queries/order/get-orders";
import { getProductSubTypes } from "@/actions/queries/products/get-product-sub-types";
import { getProductVariants } from "@/actions/queries/products/get-product-variants";
import { getOrdersCount } from "@/actions/queries/order/get-orders-count";
import VariantsFilter from "@/components/filters/variant-filter";
import { OrdersSwitch } from "./_components/orders-switch";
import { redirect } from "next/navigation";
import { getAvailableProductions } from "@/actions/queries/order/get-available-productions";
import { getWorkshops } from "@/actions/queries/workshop/get-workshops";

export default async function DemandesPage({
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const currentPage = (await searchParams).page;
  const ordersPerPage = 8;
  const [
    types,
    variants,
    orders,
    totalOrders,
    availableProductions,
    workshops,
  ] = await Promise.all([
    getProductSubTypes(),
    getProductVariants(),
    getOrders({
      currentPage: Number(currentPage || "1"),
      ordersPerPage,
      searchParams,
    }),
    getOrdersCount({ searchParams }),
    getAvailableProductions(),
    getWorkshops(),
  ]);

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        <OrdersSwitch searchParams={await searchParams} />
        <div className="flex items-center justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-4 flex-1">
            <SearchFilter
              url="/management/orders"
              searchParams={await searchParams}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <TypeFilter
              url="/management/orders"
              searchParams={await searchParams}
              types={types}
            />
            <VariantsFilter
              url="/management/orders"
              searchParams={await searchParams}
              variants={variants}
            />
          </div>
        </div>
        <OrdersTable
          orders={orders}
          currentPage={Number(currentPage || "1")}
          ordersPerPage={ordersPerPage}
          searchParams={await searchParams}
          totalOrders={totalOrders}
          availableProductions={availableProductions}
          workshops={workshops}
        />
      </div>
    </div>
  );
}
