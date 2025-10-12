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
  const types = await getProductSubTypes();
  const variants = await getProductVariants();
  const products = await getProducts();
  const tissues = await getTissues();

  return (
    <div className="p-8">
      <ProductsInterface
        searchParams={await searchParams}
        types={types}
        variants={variants}
        tissues={tissues}
        {...products}
      />
    </div>
  );
}

export default ProductsPage;
