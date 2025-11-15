"use client";

import { StockType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useStockTypesQuery = () => {
  const fetchTypes = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/stock-types",
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchTypes,
    queryKey: ["stock-types"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    data: data?.types as StockType[],
    refetch,
    isPending,
  };
};
