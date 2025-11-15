"use client";

import SearchFilter from "@/components/filters/search-filter";
import StockStatusFilter from "@/components/filters/stock-status-filter";
import StockTypeFilter from "@/components/filters/stock-type-filter";
import WorkShopFilter from "@/components/filters/workshop-filter";
import ManageStockForm from "@/components/forms/manage-stock-form";
import { Button } from "@/components/ui/button";
import { StockInTable } from "@/types/types";
import { StockType, WorkShop } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { StocksTable } from "./stock-table";
import { useWareHousesQuery } from "@/hooks/use-ware-houses-query";
import WareHouseFilter from "@/components/filters/ware-house-filter";
import { useStockssQuery } from "@/hooks/admin/use-query-stocks";
import { stockOptimisticReducer } from "@/lib/optimistic-reducers/stock-optimistic-reducer";
import { useStockTypesQuery } from "@/hooks/use-stock-types-query";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

function StockInterface({ searchParams }: Props) {
  const [isAdd, setIsAdd] = useState(false);
  const { data: warehouses, isPending: isFetchingWareHouses } =
    useWareHousesQuery();
  const { data: types, isPending: isFetchingTypes } = useStockTypesQuery();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    isPending: tanstackIsPending,
    refetch,
  } = useStockssQuery();

  const [stocks, setStocks] = useState<StockInTable[]>([]);

  useEffect(() => {
    setStocks(data?.pages[data?.pages?.length - 1]?.stocks || []);
  }, [data]);

  return (
    <div className="space-y-5">
      {!isAdd && (
        <div className="flex items-center justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-4 flex-1">
            <Button
              onClick={() => setIsAdd(true)}
              variant={"brand"}
              className="px-4">
              Ajouter un produit
            </Button>
            <SearchFilter
              url={"/management/stock"}
              searchParams={searchParams}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <WareHouseFilter
              url={"/management/stock"}
              searchParams={searchParams}
              wareHouses={warehouses}
              isPending={isFetchingWareHouses}
            />
            <StockTypeFilter
              url={"/management/stock"}
              searchParams={searchParams}
              types={types}
              isPending={isFetchingTypes}
            />
            <StockStatusFilter
              url={"/management/stock"}
              searchParams={searchParams}
            />
          </div>
        </div>
      )}
      {isAdd ? (
        <ManageStockForm
          onCancel={() => {
            setIsAdd(false);
          }}
          types={types}
          warehouses={warehouses}
          isFetchingWareHouses={isFetchingWareHouses}
          addStockOptimistic={(item) =>
            setStocks((prev) =>
              stockOptimisticReducer(prev, { type: "ADD", item })
            )
          }
          isFetchingTypes={isFetchingTypes}
        />
      ) : (
        <StocksTable
          stocks={stocks}
          data={data}
          fetchNextPage={fetchNextPage}
          fetchPreviousPage={fetchPreviousPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          tanstackIsPending={tanstackIsPending}
          refetch={refetch}
          updateStockQuantityOptimistic={(quantity, idx) =>
            setStocks((prev) =>
              stockOptimisticReducer(prev, { type: "updateQty", idx, quantity })
            )
          }
          updateStockDisponibilityOptimistic={(disponibility, idx) =>
            setStocks((prev) =>
              stockOptimisticReducer(prev, {
                type: "updateDisponibility",
                idx,
                disponibility,
              })
            )
          }
        />
      )}
    </div>
  );
}

export default StockInterface;
