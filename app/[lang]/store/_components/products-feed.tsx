"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";
import { useProductsQuery } from "@/hooks/use-query-products";
import { Product, ProductCategory } from "@prisma/client";
import ProductCard from "./product-card";
import Link from "next/link";

interface Props {
  type: ProductCategory;
  lang: any;
  dict: any;
}

function ProductsFeed({ type, dict, lang }: Props) {
  const {
    data: products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useProductsQuery({ type });

  const [Buttonref, ButtonInView] = useInView();

  useEffect(() => {
    if (ButtonInView) {
      fetchNextPage();
    }
  }, [ButtonInView]);

  return (
    <div className="flex flex-col space-y-3 md:!w-[90%] w-full max-w-[1700px] mx-auto">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-center">
          <ProductsFeed.Skelton />
          <ProductsFeed.Skelton />
          <ProductsFeed.Skelton />
          <ProductsFeed.Skelton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-center">
          {products?.pages.map((page) =>
            page?.products.map((product: Product) => (
              <Link key={product.id} href={`/store/product/${product.id}`}>
                <ProductCard product={product} dict={dict} lang={lang} />
              </Link>
            ))
          )}
        </div>
      )}
      {hasNextPage && (
        <div className="flex justify-center w-full">
          {isFetchingNextPage ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full place-items-center">
              <ProductsFeed.Skelton />
              <ProductsFeed.Skelton />
              <ProductsFeed.Skelton />
              <ProductsFeed.Skelton />
            </div>
          ) : (
            <Button
              ref={Buttonref}
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}>
              Show more
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

ProductsFeed.Skelton = function SkeltonTravel() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[285px] w-[285px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[125px]" />
      </div>
    </div>
  );
};

export default ProductsFeed;
