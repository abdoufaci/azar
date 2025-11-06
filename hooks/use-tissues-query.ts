"use client";

import {
  Cart,
  CartItem,
  Product,
  ProductPricing,
  ProductVariant,
  Tissu,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useTissuesQuery = () => {
  const fetchTissues = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/tissues",
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchTissues,
    queryKey: ["tissues"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false,
  });

  return {
    data: data?.tissues as Tissu[],
    refetch,
    isPending,
  };
};
