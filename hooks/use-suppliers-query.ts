"use client";

import { Supplier, WareHouse } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useSuppliersQuery = () => {
  const fetchSuppliers = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/suppliers",
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchSuppliers,
    queryKey: ["suppliers"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    data: data?.suppliers as Supplier[],
    refetch,
    isPending,
  };
};
