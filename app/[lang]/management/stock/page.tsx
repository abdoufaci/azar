import { getStockTypes } from "@/actions/queries/stock/get-stock-types";
import { getWorkshops } from "@/actions/queries/workshop/get-workshops";
import SearchFilter from "@/components/filters/search-filter";
import { cn } from "@/lib/utils";
import Link from "next/link";

async function StockPage({
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { target } = await searchParams;
  const workshops = await getWorkshops();
  const types = await getStockTypes();

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        <div className="w-full h-12 border-b border-b-[#9BB5BB4D] flex">
          <Link href={"/management/orders?target=stock"}>
            <div
              className={cn(
                "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
                target === "stock" ? "border-b-2 border-b-brand" : ""
              )}>
              <h1
                className={cn(
                  target === "stock" ? "text-[#576070]" : "text-[#A2ABBD]"
                )}>
                Stock
              </h1>
            </div>
          </Link>

          <Link href={"/management/orders?target=desk"}>
            <div
              className={cn(
                "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
                target === "desk" ? "border-b-2 border-b-brand" : ""
              )}>
              <h1
                className={cn(
                  target === "desk" ? "text-[#576070]" : "text-[#A2ABBD]"
                )}>
                Caisse
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StockPage;
