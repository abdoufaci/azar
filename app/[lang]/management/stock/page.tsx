import { getStockTypes } from "@/actions/queries/stock/get-stock-types";
import { getWorkshops } from "@/actions/queries/workshop/get-workshops";
import SearchFilter from "@/components/filters/search-filter";
import { cn } from "@/lib/utils";
import Link from "next/link";
import DeskInterface from "./_components/desk-interface";
import StockInterface from "./_components/stock-interface";
import { getStocks } from "@/actions/queries/stock/get-stocks";
import { getStocksCount } from "@/actions/queries/stock/get-stocks-count";
import { getDesks } from "@/actions/queries/stock/get-desks";
import { getDesksCount } from "@/actions/queries/stock/get-desks-count";
import { getPaymentsSum } from "@/actions/queries/stock/get-payments-sum";

async function StockPage({
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { target } = await searchParams;
  const currentPage = (await searchParams).page;
  const itemsPerPage = 8;
  const stocks = await getStocks({
    currentPage: Number(currentPage || "1"),
    stocksPerPage: itemsPerPage,
    searchParams,
  });
  const desks = await getDesks({
    currentPage: Number(currentPage || "1"),
    desksPerPage: itemsPerPage,
    searchParams,
  });
  const totalStocks = await getStocksCount({ searchParams });
  const totalDesks = await getDesksCount({ searchParams });
  const workshops = await getWorkshops();
  const types = await getStockTypes();
  const { todaysDeposits, todaysWithdrawals, total } = await getPaymentsSum();

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        <div className="w-full h-12 border-b border-b-[#9BB5BB4D] flex">
          <Link href={"/management/stock?target=stock"}>
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

          <Link href={"/management/stock?target=desk"}>
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
        {target === "desk" ? (
          <DeskInterface
            searchParams={await searchParams}
            currentPage={Number(currentPage || "1")}
            desks={desks}
            desksPerPage={itemsPerPage}
            totalDesks={totalDesks}
            todaysDeposits={todaysDeposits}
            todaysWithdrawals={todaysWithdrawals}
            total={total}
          />
        ) : (
          <StockInterface
            searchParams={await searchParams}
            currentPage={Number(currentPage || "1")}
            stocks={stocks}
            stocksPerPage={itemsPerPage}
            totalStocks={totalStocks}
            types={types}
            workshops={workshops}
          />
        )}
      </div>
    </div>
  );
}

export default StockPage;
