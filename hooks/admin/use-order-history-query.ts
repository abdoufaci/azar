"use client";

import {
  Cart,
  CartItem,
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
  orderId: string;
}

export const useOrderHistoryQuery = ({ orderId }: Props) => {
  const fetchOrderHistory = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/order-history",
        query: {
          orderId,
        },
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchOrderHistory,
    queryKey: ["order-history", orderId],
  });

  return {
    data: data?.history as (OrderHistory & {
      employee: User | null;
      newStage: OrderStage | null;
      oldStage: OrderStage | null;
      user: User;
    })[],
    refetch,
    isPending,
  };
};
