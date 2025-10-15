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
import {
  ProductionInTable,
  ProductVariantWithPricing,
  UserWithWorkshop,
} from "@/types/types";
import {
  OrderStage,
  Product,
  ProductAudience,
  ProductSubtype,
  Tissu,
  WorkShop,
} from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ProductionsTable } from "./productions-table";
import ManageProductionForm from "@/components/forms/manage-production-form";
import VariantsFilter from "@/components/filters/variant-filter";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  types: ProductSubtype[];
  variants: ProductVariantWithPricing[];
  tissues: Tissu[];
  clients: UserWithWorkshop[];
  employees: UserWithWorkshop[];
  workShops: WorkShop[];
  productions: ProductionInTable[];
  orderStages: OrderStage[];
  currentPage: number;
  totalProductions: number;
  productionsPerPage: number;
}

function ProductionInterface({
  searchParams,
  types,
  variants,
  tissues,
  clients,
  workShops,
  productions,
  orderStages,
  currentPage,
  productionsPerPage,
  totalProductions,
  employees,
}: Props) {
  const [isAdd, setIsAdd] = useState(false);
  const [productionToEdit, setProductionToEdit] =
    useState<ProductionInTable | null>(null);
  const [motherOrder, setMotherOrder] = useState<ProductionInTable | null>(
    null
  );

  return (
    <div className="space-y-5">
      {!isAdd && (
        <>
          <h1 className="text-2xl font-medium text-[#06191D]">Production</h1>
          <div className="flex items-center justify-between gap-5 flex-wrap">
            <div className="flex items-center gap-4 flex-1">
              <Button
                onClick={() => setIsAdd(true)}
                variant={"brand"}
                className="px-4">
                Ajouter une production
              </Button>
              <SearchFilter
                url="/management/production"
                searchParams={searchParams}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <WorkShopFilter
                url="/management/production"
                searchParams={searchParams}
                workShops={workShops}
              />
              <TypeFilter
                url="/management/production"
                searchParams={searchParams}
                types={types}
              />
              <VariantsFilter
                url="/management/production"
                searchParams={searchParams}
                variants={variants}
              />
              <StatusFilter
                url="/management/production"
                searchParams={searchParams}
                stages={orderStages}
              />
            </div>
          </div>
        </>
      )}
      {isAdd ? (
        <ManageProductionForm
          motherOrder={motherOrder}
          onCancel={() => {
            setIsAdd(false);
            setProductionToEdit(null);
          }}
          types={types}
          variants={variants}
          production={productionToEdit}
          tissues={tissues}
          workShops={workShops}
          clients={clients}
          key={productionToEdit?.id}
        />
      ) : (
        <ProductionsTable
          productions={productions}
          orderStages={orderStages}
          employees={employees}
          onClick={(item) => {
            setProductionToEdit(item);
            setIsAdd(true);
          }}
          onSubOrderClick={(item) => {
            setMotherOrder(item);
            setIsAdd(true);
          }}
          currentPage={currentPage}
          productionsPerPage={productionsPerPage}
          totalProductions={totalProductions}
          searchParams={searchParams}
        />
      )}
    </div>
  );
}

export default ProductionInterface;
