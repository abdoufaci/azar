"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useFilterModal } from "../use-filter-modal-store";
import qs from "query-string";
import { ProductAudience } from "@prisma/client";

interface Props {
  target: ProductAudience;
}

export const useOrdersQuery = ({ target }: Props) => {
  const { admin: filterData } = useFilterModal();

  const fetchOrders = async ({
    pageParam = undefined,
  }: {
    pageParam?: string;
  }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/orders",
        query: {
          cursor: pageParam,
          ...filterData,
          target,
        },
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isLoadingError,
    refetch,
    fetchPreviousPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["orders", filterData, target],
    queryFn: fetchOrders,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialPageParam: undefined,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    fetchNextPage,
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isLoadingError,
    refetch,
    fetchPreviousPage,
    isPending,
  };
};
