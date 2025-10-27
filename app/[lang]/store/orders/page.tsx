import { getOrders } from "@/actions/queries/order/get-orders";
import { getOrdersCount } from "@/actions/queries/order/get-orders-count";
import { currentUser } from "@/lib/auth";
import { ClientOrdersTable } from "./_components/client-orders-table";
import { redirect } from "next/navigation";

async function OrdersPage({
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }
  const currentPage = (await searchParams).page;
  const ordersPerPage = 8;
  const orders = await getOrders({
    currentPage: Number(currentPage || "1"),
    ordersPerPage,
    searchParams,
    clientId: user?.id,
  });
  const totalOrders = await getOrdersCount({
    searchParams,
    clientId: user?.id,
  });
  return (
    <div className="min-h-screen py-20 w-[90%] mx-auto space-y-10">
      <h1 className="font-semibold text-3xl text-[#06191D]">Commandes</h1>
      <ClientOrdersTable
        orders={orders}
        currentPage={Number(currentPage || "1")}
        ordersPerPage={ordersPerPage}
        searchParams={await searchParams}
        totalOrders={totalOrders}
      />
    </div>
  );
}

export default OrdersPage;
