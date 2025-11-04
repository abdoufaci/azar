"use client";

import { ProductionInTable } from "@/types/types";
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
  orderId?: string | null;
}

export const useOrderQuery = ({ orderId }: Props) => {
  if (!orderId) return null;
  const fetchOrderHistory = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/order",
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
    data: data?.order as ProductionInTable,
    refetch,
    isPending,
  };
};
