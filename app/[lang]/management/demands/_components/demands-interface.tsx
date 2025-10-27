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
  DemandInTable,
  ProductionInTable,
  ProductVariantWithPricing,
  UserWithWorkshop,
} from "@/types/types";
import {
  DemandMaterial,
  DemandStage,
  OrderStage,
  Product,
  ProductAudience,
  ProductSubtype,
  Tissu,
  WorkShop,
} from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import VariantsFilter from "@/components/filters/variant-filter";
import { DemandesTable } from "./demandes-table";
import ManageDemandForm from "@/components/forms/manage-demand-form";
import MaterialFilter from "@/components/filters/material-filter";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  workShops: WorkShop[];
  demands: DemandInTable[];
  stages: DemandStage[];
  currentPage: number;
  totalDemands: number;
  demandsPerPage: number;
  materials: DemandMaterial[];
  url?: string;
}

function DemandsInterface({
  searchParams,
  workShops,
  demands,
  currentPage,
  demandsPerPage,
  totalDemands,
  materials,
  stages,
  url = "/management/demands",
}: Props) {
  const [isAdd, setIsAdd] = useState(false);

  return (
    <div className="space-y-5">
      {!isAdd && (
        <>
          <h1 className="text-2xl font-medium text-[#06191D]">Les Demandes</h1>
          <div className="flex items-center justify-between gap-5 flex-wrap">
            <div className="flex items-center gap-4 flex-1">
              <Button
                onClick={() => setIsAdd(true)}
                variant={"brand"}
                className="px-4">
                Ajouter une demande
              </Button>
              <SearchFilter url={url} searchParams={searchParams} />
            </div>
            <div className="flex items-center gap-3">
              {url === "/management/demands" && (
                <WorkShopFilter
                  url={url}
                  searchParams={searchParams}
                  workShops={workShops}
                />
              )}
              <MaterialFilter
                url={url}
                searchParams={searchParams}
                materials={materials}
              />
              <PriorityFilter url={url} searchParams={searchParams} />
              <StatusFilter
                url={url}
                searchParams={searchParams}
                stages={stages}
              />
            </div>
          </div>
        </>
      )}
      {isAdd ? (
        <ManageDemandForm
          materials={materials}
          onCancel={() => setIsAdd(false)}
          workShops={workShops}
        />
      ) : (
        <DemandesTable
          currentPage={currentPage}
          demands={demands}
          demandsPerPage={demandsPerPage}
          searchParams={searchParams}
          stages={stages}
          totalDemands={totalDemands}
          url={url}
        />
      )}
    </div>
  );
}

export default DemandsInterface;
