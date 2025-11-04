"use client";

import { OrderWithRelationsWithCells } from "@/types/types";
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

export const useSubOrdersQuery = ({ orderId }: Props) => {
  const fetchOrderHistory = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/sub-orders",
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
    queryKey: ["sub-orders", orderId],
  });

  return {
    data: data?.orders as OrderWithRelationsWithCells[],
    refetch,
    isPending,
  };
};
