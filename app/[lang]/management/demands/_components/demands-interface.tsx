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
import { useOptimistic, useState, useTransition } from "react";
import VariantsFilter from "@/components/filters/variant-filter";
import { DemandesTable } from "./demandes-table";
import ManageDemandForm from "@/components/forms/manage-demand-form";
import MaterialFilter from "@/components/filters/material-filter";
import { useDemandsQuery } from "@/hooks/admin/use-query-demands";
import { demandOptimisticReducer } from "@/lib/optimistic-reducers/demand-optimistic-reducer";
import { useWorkShopsQuery } from "@/hooks/use-workshops-query";
import Link from "next/link";
import ArchiveButton from "@/components/archive-button";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  stages: DemandStage[];
  materials: DemandMaterial[];
  url?: string;
}

function DemandsInterface({
  searchParams,
  materials,
  stages,
  url = "/management/demands",
}: Props) {
  const [isAdd, setIsAdd] = useState(false);

  const { data: workShops, isPending: isFetchingWorkShops } =
    useWorkShopsQuery();
  const { data } = useDemandsQuery({ isArchive: !!searchParams?.isArchive });
  const latest = data?.pages[data?.pages?.length - 1]
    ?.demands as DemandInTable[];
  const [demands, manageDemandOptimistic] = useOptimistic(
    latest,
    demandOptimisticReducer
  );
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-5">
      {!isAdd && (
        <>
          <div className="flex items-center gap-5">
            <h1 className="text-2xl font-medium text-[#06191D]">
              Les Demandes {!!searchParams?.isArchive && "- Archive"}
            </h1>
            {!searchParams?.isArchive && <ArchiveButton url={url} />}
          </div>
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
                  isPending={isFetchingWorkShops}
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
          addDemandOptimistic={(item) =>
            startTransition(() => {
              manageDemandOptimistic({ type: "ADD", item });
            })
          }
          updateDemandOptimistic={(item) =>
            startTransition(() => {
              manageDemandOptimistic({
                type: "updateDemand",
                production: item,
              });
            })
          }
        />
      ) : (
        <DemandesTable
          stages={stages}
          demands={demands}
          updateStageOptimistic={(stage, idx) =>
            startTransition(() => {
              manageDemandOptimistic({ type: "updateStage", stage, idx });
            })
          }
          deleteDemandOptimistic={(id) => {
            startTransition(() => {
              manageDemandOptimistic({ type: "DELETE", id });
            });
          }}
        />
      )}
    </div>
  );
}

export default DemandsInterface;
