import ProductionInterface from "./_components/production-interface";
import { getWorkshops } from "@/actions/queries/workshop/get-workshops";
import { getOrderStages } from "@/actions/queries/order/get-order-stages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Production",
  description: "A platform for managing forniture",
  icons: {
    icon: "/icon.png",
    href: "/icon.png",
  },
};

export default async function ProductionPage({
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const [orderStages] = await Promise.all([getOrderStages()]);

  return (
    <div className="p-8">
      <ProductionInterface
        searchParams={await searchParams}
        orderStages={orderStages}
        columns={[]}
      />
    </div>
  );
}
