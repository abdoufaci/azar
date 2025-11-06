"use client";

import {
  Cart,
  CartItem,
  Product,
  ProductPricing,
  ProductSubtype,
  ProductVariant,
  Tissu,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useTypesQuery = () => {
  const fetchTypes = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/types",
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchTypes,
    queryKey: ["types"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    data: data?.types as ProductSubtype[],
    refetch,
    isPending,
  };
};
