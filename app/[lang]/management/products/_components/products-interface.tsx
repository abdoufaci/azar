"use client";

import ProductCard from "@/app/[lang]/store/_components/product-card";
import PriorityFilter from "@/components/filters/priority-filter";
import SearchFilter from "@/components/filters/search-filter";
import StatusFilter from "@/components/filters/status-filter";
import TypeFilter from "@/components/filters/type-filter";
import WorkShopFilter from "@/components/filters/workshop-filter";
import ManageProductForm from "@/components/forms/manage-product-form";
import { OpenDialogButton } from "@/components/open-dialog-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductVariantWithPricing } from "@/types/types";
import {
  Product,
  ProductAudience,
  ProductSubtype,
  Tissu,
} from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  types: ProductSubtype[];
  variants: ProductVariantWithPricing[];
  Bproducts: (Product & {
    tissues: Tissu[];
  })[];
  Cproducts: (Product & {
    tissues: Tissu[];
  })[];
  tissues: Tissu[];
}

function ProductsInterface({
  searchParams,
  types,
  variants,
  Bproducts,
  Cproducts,
  tissues,
}: Props) {
  const [activeTab, setActiveTab] = useState<ProductAudience>(
    ProductAudience.B2B
  );
  const [isAdd, setIsAdd] = useState(false);
  const [productToEdit, setProductToEdit] = useState<
    | (Product & {
        tissues: Tissu[];
      })
    | null
  >(null);

  return (
    <div className="space-y-5">
      {!isAdd && (
        <>
          <h1 className="text-2xl font-medium text-[#06191D]">Produits</h1>
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
              {/* <WorkShopFilter
            url="/management/production"
            searchParams={searchParams}
          />
          <TypeFilter url="/management/products" searchParams={searchParams} />
          <PriorityFilter
            url="/management/products"
            searchParams={searchParams}
          />
          <StatusFilter
            url="/management/products"
            searchParams={searchParams}
          /> */}
            </div>
          </div>
        </>
      )}
      {activeTab === "B2B" && (
        <>
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
            />
          ) : (
            <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 gap-6 w-full">
              {Bproducts.map((product) => (
                <div
                  onClick={() => {
                    setIsAdd(true);
                    setProductToEdit(product);
                  }}>
                  <ProductCard product={product} key={product.id} isAdmin />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {activeTab === "B2C" && (
        <>
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
              tissues={tissues}
              key={productToEdit?.id}
            />
          ) : (
            <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 gap-6 w-full">
              {Cproducts.map((product) => (
                <div
                  onClick={() => {
                    setIsAdd(true);
                    setProductToEdit(product);
                  }}>
                  <ProductCard product={product} key={product.id} isAdmin />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductsInterface;
