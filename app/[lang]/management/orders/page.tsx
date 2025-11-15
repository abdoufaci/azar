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
import { Metadata } from "next";
import OrdersInterface from "./_components/orders-interface";

export const metadata: Metadata = {
  title: "Commande",
  description: "A platform for managing forniture",
  icons: {
    icon: "/icon.png",
    href: "/icon.png",
  },
};

export default async function DemandesPage() {
  return (
    <div className="min-h-screen p-8">
      <OrdersInterface />
    </div>
  );
}
