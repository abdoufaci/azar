"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useFilterModal } from "../use-filter-modal-store";
import qs from "query-string";

export const useStockssQuery = () => {
  const { admin: filterData, stock } = useFilterModal();

  const fetchStocks = async ({
    pageParam = undefined,
  }: {
    pageParam?: string;
  }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/stocks",
        query: {
          cursor: pageParam,
          ...stock,
          ...filterData,
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
    queryKey: ["stocks", filterData, stock],
    queryFn: fetchStocks,
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
