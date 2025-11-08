import { useInfiniteQuery } from "@tanstack/react-query";
import { useFilterModal } from "./use-filter-modal-store";
import qs from "query-string";
import { ProductAudience, ProductCategory } from "@prisma/client";

interface Props {
  audience: ProductAudience;
  isArchive?: boolean;
}

export const useProductsQuery = ({ audience, isArchive = false }: Props) => {
  const { admin: filterData } = useFilterModal();

  const fetchCars = async ({
    pageParam = undefined,
  }: {
    pageParam?: string;
  }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/products",
        query: {
          ...filterData,
          audience,
          cursor: pageParam,
          isArchive,
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
  } = useInfiniteQuery({
    queryKey: ["products", filterData, audience, isArchive],
    queryFn: fetchCars,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialPageParam: undefined,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    fetchNextPage,
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isLoadingError,
    refetch,
  };
};
