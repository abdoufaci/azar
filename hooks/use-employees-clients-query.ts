"use client";

import { UserInTable, UserWithWorkshop } from "@/types/types";
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

export const useEmployeesClientsQuery = ({
  workshopId,
  target,
  includeAdmin = false,
}: {
  workshopId?: string | null;
  target: "employee" | "client";
  includeAdmin?: boolean;
}) => {
  const fetchEmployeesClients = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/employees-clients",
        query: {
          workshopId,
          target,
          includeAdmin,
        },
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchEmployeesClients,
    queryKey: ["employees-clients", target, workshopId],
  });

  return {
    data: data?.users as UserWithWorkshop[],
    refetch,
    isPending,
  };
};
