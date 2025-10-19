import React from "react";
import SearchFilterBar from "./filters-bar/search-filter-bar";
import VariantFilterBar from "./filters-bar/variant-filter-bar";
import TypeFilterBar from "./filters-bar/type-filter-bar";
import PriceFilterBar from "./filters-bar/price-filter-bar";
import { getProductSubTypes } from "@/actions/queries/products/get-product-sub-types";
import { getProductVariants } from "@/actions/queries/products/get-product-variants";

interface Props {
  dict: any;
  lang: any;
}

async function FiltersBar({ dict, lang }: Props) {
  const types = await getProductSubTypes();
  const variants = await getProductVariants();

  return (
    <div className="flex flex-wrap items-center justify-center gap-5 w-full">
      <SearchFilterBar lang={lang} />
      <VariantFilterBar lang={lang} variants={variants} />
      <TypeFilterBar lang={lang} types={types} />
      <PriceFilterBar lang={lang} />
    </div>
  );
}

export default FiltersBar;
