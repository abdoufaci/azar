import { useInfiniteQuery } from "@tanstack/react-query";
import { useFilterModal } from "./use-filter-modal-store";
import qs from "query-string";
import { ProductCategory } from "@prisma/client";

interface Props {
  type: ProductCategory;
}

export const useProductsQuery = ({ type }: Props) => {
  const { data: filterData } = useFilterModal();

  const fetchCars = async ({
    pageParam = undefined,
  }: {
    pageParam?: string;
  }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/products",
        query: {
          min: filterData.price?.min,
          max: filterData.price?.max,
          search: filterData.search,
          variantId: filterData.variantId,
          subtypeId: filterData.subtypeId,
          type,
          cursor: pageParam,
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
    queryKey: ["products", filterData],
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
  };
};
