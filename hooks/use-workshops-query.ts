"use client";

import { WorkShop } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useWorkShopsQuery = () => {
  const fetchWorkShops = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/workshops",
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchWorkShops,
    queryKey: ["workshops"],
  });

  return {
    data: data?.workshops as WorkShop[],
    refetch,
    isPending,
  };
};
