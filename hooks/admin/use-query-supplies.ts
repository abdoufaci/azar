"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useFilterModal } from "../use-filter-modal-store";
import qs from "query-string";

export const useSuppliesQuery = () => {
  const { supply: filterData, admin, stock, desk } = useFilterModal();

  const fetchSupplies = async ({
    pageParam = undefined,
  }: {
    pageParam?: string;
  }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/supplies",
        query: {
          cursor: pageParam,
          ...filterData,
          ...admin,
          ...stock,
          ...desk,
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
    queryKey: ["supplies", filterData, admin, stock, desk],
    queryFn: fetchSupplies,
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
