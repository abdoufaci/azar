"use client";

import { ProductVariantWithPricing } from "@/types/types";
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

export const useVariantsQuery = () => {
  const fetchVariants = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/variants",
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchVariants,
    queryKey: ["variants"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    data: data?.variants as ProductVariantWithPricing[],
    refetch,
    isPending,
  };
};
