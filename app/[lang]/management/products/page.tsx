import React from "react";
import ProductsInterface from "./_components/products-interface";
import { getProductSubTypes } from "@/actions/queries/products/get-product-sub-types";
import { getProductVariants } from "@/actions/queries/products/get-product-variants";
import { getProducts } from "@/actions/queries/products/get-products";
import { getTissues } from "@/actions/queries/products/get-tissues";

async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const [tissues] = await Promise.all([getTissues()]);

  return (
    <div className="p-8">
      <ProductsInterface searchParams={await searchParams} tissues={tissues} />
    </div>
  );
}

export default ProductsPage;
