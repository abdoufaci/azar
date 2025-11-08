"use client";

import ProductCard from "@/app/[lang]/store/_components/product-card";
import ArchiveButton from "@/components/archive-button";
import SearchFilter from "@/components/filters/search-filter";
import TypeFilter from "@/components/filters/type-filter";
import VariantsFilter from "@/components/filters/variant-filter";
import ManageProductForm from "@/components/forms/manage-product-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductsQuery } from "@/hooks/use-query-products";
import { useTypesQuery } from "@/hooks/use-types-query";
import { useVariantsQuery } from "@/hooks/use-variants-query";
import { productOptimisticReducer } from "@/lib/optimistic-reducers/product-optimistic-reducer copy";
import { cn } from "@/lib/utils";
import { ProductInTable, ProductVariantWithPricing } from "@/types/types";
import {
  Product,
  ProductAudience,
  ProductPrices,
  ProductPricing,
  ProductSubtype,
  Tissu,
} from "@prisma/client";
import { Plus } from "lucide-react";
import { useEffect, useOptimistic, useState } from "react";
import { useInView } from "react-intersection-observer";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  tissues: Tissu[];
}

function ProductsInterface({ searchParams, tissues }: Props) {
  const [activeTab, setActiveTab] = useState<ProductAudience>(
    ProductAudience.B2B
  );
  const [isAdd, setIsAdd] = useState(false);
  const [productToEdit, setProductToEdit] = useState<
    | (Product & {
        tissues: Tissu[];
        prices: ProductPrices[];
        pricings: (ProductPricing & {
          subtype: ProductSubtype;
        })[];
      })
    | null
  >(null);

  const { data: variants, isPending: isFetchingVariants } = useVariantsQuery();
  const { data: types, isPending: isFetchingTypes } = useTypesQuery();

  const {
    data: intialProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useProductsQuery({
    audience: activeTab,
    isArchive: !!searchParams?.isArchive,
  });

  const [products, manageProductOptimistic] = useOptimistic(
    intialProducts?.pages.flatMap((page) => page?.products) as ProductInTable[],
    productOptimisticReducer
  );

  const [Buttonref, ButtonInView] = useInView();

  useEffect(() => {
    if (ButtonInView) {
      fetchNextPage();
    }
  }, [ButtonInView]);

  return (
    <div className="space-y-5">
      {!isAdd && (
        <>
          <div className="flex items-center gap-5">
            <h1 className="text-2xl font-medium text-[#06191D]">
              Produits {!!searchParams?.isArchive && "- Archive"}
            </h1>

            {!searchParams?.isArchive && (
              <ArchiveButton url={"/management/products"} />
            )}
          </div>
          <div className="w-full h-12 border-b border-b-[#9BB5BB4D] flex">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsAdd(false);
                setProductToEdit(null);
                setActiveTab(ProductAudience.B2B);
              }}
              className={cn(
                "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
                activeTab === "B2B" ? "border-b-2 border-b-brand" : ""
              )}>
              <h1
                className={cn(
                  activeTab === "B2B" ? "text-[#576070]" : "text-[#A2ABBD]"
                )}>
                B2B
              </h1>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsAdd(false);
                setProductToEdit(null);
                setActiveTab(ProductAudience.B2C);
              }}
              className={cn(
                "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
                activeTab === "B2C" ? "border-b-2 border-b-brand" : ""
              )}>
              <h1
                className={cn(
                  activeTab === "B2C" ? "text-[#576070]" : "text-[#A2ABBD]"
                )}>
                B2C
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-between gap-5 flex-wrap">
            <div className="flex items-center gap-4 flex-1">
              <Button
                onClick={() => setIsAdd(true)}
                variant={"brand"}
                className="px-4">
                Ajouter Produit
              </Button>
              <SearchFilter
                url="/management/products"
                searchParams={searchParams}
              />
            </div>
            <div className="flex items-center gap-3">
              <TypeFilter
                url={""}
                searchParams={searchParams}
                types={types}
                isPending={isFetchingTypes}
              />
              <VariantsFilter
                url={""}
                searchParams={searchParams}
                variants={variants}
                isPending={isFetchingVariants}
              />
            </div>
          </div>
        </>
      )}
      {isAdd ? (
        <ManageProductForm
          onCancel={() => {
            setIsAdd(false);
            setProductToEdit(null);
          }}
          types={types}
          variants={variants}
          audience={activeTab}
          product={productToEdit}
          key={productToEdit?.id}
          tissues={tissues}
          addProductOptimistic={(item) => {
            manageProductOptimistic({ type: "ADD", item });
            refetch();
          }}
          updateProductOptimistic={(product) =>
            manageProductOptimistic({ type: "updateProduct", product })
          }
          deleteProductOptimistic={(id) => {
            manageProductOptimistic({ type: "DELETE", id });
            refetch();
          }}
        />
      ) : (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-center">
              <ProductsInterface.Skelton />
              <ProductsInterface.Skelton />
              <ProductsInterface.Skelton />
              <ProductsInterface.Skelton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-center">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setIsAdd(true);
                    setProductToEdit(product);
                  }}>
                  <ProductCard
                    refetch={refetch}
                    deleteProductOptimistic={(id) =>
                      manageProductOptimistic({ type: "DELETE", id })
                    }
                    product={product}
                    key={product.id}
                    isAdmin
                  />
                </div>
              ))}
            </div>
          )}
          {hasNextPage && (
            <div className="flex justify-center w-full">
              {isFetchingNextPage ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full place-items-center">
                  <ProductsInterface.Skelton />
                  <ProductsInterface.Skelton />
                  <ProductsInterface.Skelton />
                  <ProductsInterface.Skelton />
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
        </>
      )}
    </div>
  );
}

ProductsInterface.Skelton = function SkeltonTravel() {
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

export default ProductsInterface;
