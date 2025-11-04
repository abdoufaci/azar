"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useFilterModal } from "../use-filter-modal-store";
import qs from "query-string";

export const useProductionsQuery = () => {
  const { data: filter } = useFilterModal();
  const { admin: filterData } = filter;

  const fetchCars = async ({
    pageParam = undefined,
  }: {
    pageParam?: string;
  }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/productions",
        query: {
          cursor: pageParam,
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
    queryKey: ["productions", filterData],
    queryFn: fetchCars,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialPageParam: undefined,
    refetchInterval: false,
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
