"use client";

import { WareHouse } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useWareHousesQuery = () => {
  const fetchWareHouses = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/warehouses",
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchWareHouses,
    queryKey: ["warehouses"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    data: data?.warehouses as WareHouse[],
    refetch,
    isPending,
  };
};
