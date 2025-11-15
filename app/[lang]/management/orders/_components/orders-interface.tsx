"use client";

import SearchFilter from "@/components/filters/search-filter";
import TypeFilter from "@/components/filters/type-filter";
import VariantsFilter from "@/components/filters/variant-filter";
import { useOrdersQuery } from "@/hooks/admin/use-query-orders";
import { useTypesQuery } from "@/hooks/use-types-query";
import { useVariantsQuery } from "@/hooks/use-variants-query";
import { cn } from "@/lib/utils";
import { OrderInTable, UserInTable } from "@/types/types";
import { ProductAudience } from "@prisma/client";
import { useEffect, useState } from "react";
import { OrdersTable } from "./orders-table";
import { orderOptimisticReducer } from "@/lib/optimistic-reducers/order-optimistic-reducer";

function OrdersInterface() {
  const [activeTab, setActiveTab] = useState<ProductAudience>("B2B");
  const [isAdd, setIsAdd] = useState(false);
  const [orders, setOrders] = useState<OrderInTable[]>([]);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    isPending: tanstackIsPending,
  } = useOrdersQuery({ target: activeTab });

  useEffect(() => {
    setOrders(data?.pages[data?.pages?.length - 1]?.orders || []);
  }, [data]);

  const { data: variants, isPending: isFetchingVariants } = useVariantsQuery();
  const { data: types, isPending: isFetchingTypes } = useTypesQuery();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-medium text-[#06191D]">Command De Client</h1>
      <div className="w-full h-12 border-b border-b-[#9BB5BB4D] flex">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("B2B");
          }}
          className={cn(
            "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
            activeTab === "B2B" ? "border-b-2 border-b-brand" : ""
          )}>
          <h1
            className={cn(
              activeTab === "B2B" ? "text-[#576070]" : "text-[#A2ABBD]"
            )}>
            B2B
          </h1>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("B2C");
          }}
          className={cn(
            "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
            activeTab === "B2C" ? "border-b-2 border-b-brand" : ""
          )}>
          <h1
            className={cn(
              activeTab === "B2C" ? "text-[#576070]" : "text-[#A2ABBD]"
            )}>
            B2C
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-between gap-5 flex-wrap">
        <div className="flex items-center gap-4 flex-1">
          <SearchFilter />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <TypeFilter types={types} isPending={isFetchingTypes} />
          <VariantsFilter variants={variants} isPending={isFetchingVariants} />
        </div>
      </div>
      <OrdersTable
        orders={orders}
        data={data}
        fetchNextPage={fetchNextPage}
        fetchPreviousPage={fetchPreviousPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        tanstackIsPending={tanstackIsPending}
        onUpdateStatus={(idx, status) =>
          setOrders((prev) =>
            orderOptimisticReducer(prev, { type: "updateStatus", idx, status })
          )
        }
      />
    </div>
  );
}

export default OrdersInterface;
