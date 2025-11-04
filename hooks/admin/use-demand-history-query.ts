"use client";

import {
  Cart,
  CartItem,
  DemandHistory,
  DemandStage,
  Order,
  OrderHistory,
  OrderStage,
  Product,
  ProductPricing,
  Tissu,
  User,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import qs from "query-string";

interface Props {
  demandId: string;
}

export const useDemandHistoryQuery = ({ demandId }: Props) => {
  const fetchOrderHistory = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/demand-history",
        query: {
          demandId,
        },
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchOrderHistory,
    queryKey: ["demand-history", demandId],
  });

  return {
    data: data?.history as (DemandHistory & {
      user: User;
      newStage: DemandStage | null;
      oldStage: DemandStage | null;
    })[],
    refetch,
    isPending,
  };
};
