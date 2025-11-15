"use client";

import {
  Cart,
  CartItem,
  DemandMaterial,
  Product,
  ProductPricing,
  ProductSubtype,
  ProductVariant,
  Tissu,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useMaterialsQuery = () => {
  const fetchMaterials = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/materials",
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchMaterials,
    queryKey: ["materials"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    data: data?.materials as DemandMaterial[],
    refetch,
    isPending,
  };
};
