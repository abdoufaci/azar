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
  OrderColumn,
  OrderColumnStatus,
  OrderStage,
  Product,
  ProductAudience,
  ProductSubtype,
  Tissu,
  WorkShop,
} from "@prisma/client";
import { CircleFadingPlus, Plus } from "lucide-react";
import { useState } from "react";
import ProductionInterface from "../../../production/_components/production-interface";
import DemandsInterface from "../../../demands/_components/demands-interface";
import { useRouter } from "next/navigation";
import { ManageEmployeeForm } from "@/components/forms/manage-employee-form";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  types: ProductSubtype[];
  variants: ProductVariantWithPricing[];
  tissues: Tissu[];
  clients: UserWithWorkshop[];
  employees: UserWithWorkshop[];
  workShops: WorkShop[];
  workshop: WorkShop | null;
  productions: ProductionInTable[];
  orderStages: OrderStage[];
  currentPage: number;
  totalProductions: number;
  itemsPerPage: number;
  demands: DemandInTable[];
  stages: DemandStage[];
  totalDemands: number;
  materials: DemandMaterial[];
  url: string;
  columns: (OrderColumn & {
    statuses: OrderColumnStatus[];
  })[];
}

function WorkshopInterface({
  clients,
  currentPage,
  demands,
  employees,
  materials,
  orderStages,
  productions,
  itemsPerPage,
  searchParams,
  stages,
  tissues,
  totalDemands,
  totalProductions,
  types,
  variants,
  workShops,
  workshop,
  url,
  columns,
}: Props) {
  const [activeTab, setActiveTab] = useState("main");
  const [isAdd, setIsAdd] = useState(false);
  const router = useRouter();

  return isAdd ? (
    <div className="w-full max-w-xl mx-auto space-y-5">
      <div className="space-y-1">
        <h5 className="text-sm text-brand">Ajouter un employée</h5>
        <h1 className="text-3xl font-medium text-[#06191D]">
          Les Informations de <span className="text-brand">Employée</span>
        </h1>
      </div>
      <ManageEmployeeForm
        workshops={workShops}
        onCancel={() => {
          setIsAdd(false);
        }}
        user={null}
        workshop={workshop}
      />
    </div>
  ) : (
    <div className="space-y-5">
      <h1 className="text-2xl font-medium text-[#06191D]">{workshop?.name}</h1>
      <div className="flex justify-between items-center gap-5 border-b border-b-[#9BB5BB4D]">
        <div className="w-full h-12 border-b border-b-[#9BB5BB4D] flex">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsAdd(false);
              router.push(url);
              setActiveTab("main");
            }}
            className={cn(
              "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
              activeTab === "main" ? "border-b-2 border-b-brand" : ""
            )}>
            <h1
              className={cn(
                activeTab === "main" ? "text-[#576070]" : "text-[#A2ABBD]"
              )}>
              Principal
            </h1>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsAdd(false);
              router.push(url);
              setActiveTab("demands");
            }}
            className={cn(
              "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
              activeTab === "demands" ? "border-b-2 border-b-brand" : ""
            )}>
            <h1
              className={cn(
                activeTab === "demands" ? "text-[#576070]" : "text-[#A2ABBD]"
              )}>
              Demandes
            </h1>
          </div>
        </div>
        <CircleFadingPlus
          onClick={() => setIsAdd(true)}
          color="#1E78FF"
          strokeWidth={1.25}
          style={{
            backgroundColor: "#E7F1F8",
          }}
          className="rounded-full cursor-pointer"
        />
      </div>
      {!isAdd && activeTab === "main" && (
        <ProductionInterface
          searchParams={searchParams}
          types={types}
          variants={variants}
          tissues={tissues}
          clients={clients}
          employees={employees}
          workShops={workShops}
          //@ts-ignore
          productions={productions}
          orderStages={orderStages}
          currentPage={currentPage}
          productionsPerPage={itemsPerPage}
          totalProductions={totalProductions}
          url={url}
          columns={columns}
        />
      )}
      {!isAdd && activeTab === "demands" && (
        <DemandsInterface
          currentPage={currentPage}
          demandsPerPage={itemsPerPage}
          demands={demands}
          searchParams={searchParams}
          stages={stages}
          totalDemands={totalDemands}
          workShops={workShops}
          materials={materials}
          url={url}
        />
      )}
    </div>
  );
}

export default WorkshopInterface;
