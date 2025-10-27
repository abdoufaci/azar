"use client";

import SearchFilter from "@/components/filters/search-filter";
import StockStatusFilter from "@/components/filters/stock-status-filter";
import StockTypeFilter from "@/components/filters/stock-type-filter";
import WorkShopFilter from "@/components/filters/workshop-filter";
import { Button } from "@/components/ui/button";
import { StockType, WorkShop } from "@prisma/client";
import { useState, useTransition } from "react";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  workshops: WorkShop[];
  types: StockType[];
}

function StockInterface({ searchParams, workshops, types }: Props) {
  const [isAdd, setIsAdd] = useState(false);
  const [isPending, startTransition] = useTransition();

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
            <WorkShopFilter
              url={"/management/stock"}
              searchParams={searchParams}
              workShops={workshops}
            />
            <StockTypeFilter
              url={"/management/stock"}
              searchParams={searchParams}
              types={types}
            />
            <StockStatusFilter
              url={"/management/stock"}
              searchParams={searchParams}
            />
          </div>
        </div>
      )}
      {isAdd ? <div></div> : <div></div>}
    </div>
  );
}

export default StockInterface;
