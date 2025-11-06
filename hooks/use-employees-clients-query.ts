"use client";

import { UserWithWorkshop } from "@/types/types";
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

export const useEmployeesClientsQuery = (workshopId?: string | null) => {
  const fetchEmployeesClients = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/employees-clients",
        query: {
          workshopId,
        },
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchEmployeesClients,
    queryKey: ["employees-clients"],
  });

  return {
    data: data?.users as {
      employees: UserWithWorkshop[];
      clients: UserWithWorkshop[];
    },
    refetch,
    isPending,
  };
};
