"use client";

import { OrderWithRelations } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useAvailableProductionsQuery = () => {
  const fetchAvailableProductions = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/available-productions",
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchAvailableProductions,
    queryKey: ["available-productions"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    data: data?.productions as OrderWithRelations[],
    refetch,
    isPending,
  };
};
