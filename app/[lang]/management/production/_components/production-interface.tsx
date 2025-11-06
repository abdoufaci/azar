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
  OrderColumn,
  OrderColumnStatus,
  OrderColumnType,
  OrderStage,
  Product,
  ProductAudience,
  ProductSubtype,
  Tissu,
  WorkShop,
} from "@prisma/client";
import { Plus } from "lucide-react";
import { useMemo, useOptimistic, useRef, useState, useTransition } from "react";
import ManageProductionForm from "@/components/forms/manage-production-form";
import VariantsFilter from "@/components/filters/variant-filter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addColumn } from "@/actions/mutations/order/add-column";
import { toast } from "sonner";
import ProductionsTable from "./productions-table";
import { useProductionsQuery } from "@/hooks/admin/use-query-productions";
import { productionOptimisticReducer } from "@/lib/optimistic-reducers/production-optimistic-reducer";
import { useTissuesQuery } from "@/hooks/use-tissues-query";
import { useTypesQuery } from "@/hooks/use-types-query";
import { useVariantsQuery } from "@/hooks/use-variants-query";
import { useEmployeesClientsQuery } from "@/hooks/use-employees-clients-query";
import { useWorkShopsQuery } from "@/hooks/use-workshops-query";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  orderStages: OrderStage[];
  url?: string;
  columns: (OrderColumn & {
    statuses: OrderColumnStatus[];
  })[];
}

function ProductionInterface({
  searchParams,
  orderStages,
  columns,
  url = "/management/production",
}: Props) {
  const { data: workShops, isPending: isFetchingWorkShops } =
    useWorkShopsQuery();
  const [isAdd, setIsAdd] = useState(false);
  const [productionToEdit, setProductionToEdit] =
    useState<ProductionInTable | null>(null);
  const [motherOrder, setMotherOrder] = useState<ProductionInTable | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const { data } = useProductionsQuery();
  const [productions, manageProductionOptimistic] = useOptimistic(
    data?.pages[data?.pages?.length - 1]?.productions || [],
    productionOptimisticReducer
  );
  const { data: variants, isPending: isFetchingVariants } = useVariantsQuery();
  const { data: types, isPending: isFetchingTypes } = useTypesQuery();

  const onAddColumn = async (type: OrderColumnType) => {
    startTransition(() => {
      addColumn(type)
        .then(() => toast.success("Success !"))
        .catch(() => toast.error("Erreur ."));
    });
  };

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
              <SearchFilter url={url} searchParams={searchParams} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {url === "/management/production" && (
                <WorkShopFilter
                  url={url}
                  searchParams={searchParams}
                  workShops={workShops}
                  isPending={isFetchingWorkShops}
                />
              )}
              <TypeFilter
                url={url}
                searchParams={searchParams}
                types={types}
                isPending={isFetchingTypes}
              />
              <VariantsFilter
                url={url}
                searchParams={searchParams}
                variants={variants}
                isPending={isFetchingVariants}
              />
              <StatusFilter
                url={url}
                searchParams={searchParams}
                stages={orderStages}
              />
              {/* <Popover>
                <PopoverTrigger className="max-md:!hidden">
                  <div className="w-10 h-10 rounded-full bg-[#056BE421] flex items-center justify-center cursor-pointer">
                    <div className="w-[18px] h-[18px] rounded-md flex items-center justify-center border border-brand">
                      <Plus className="text-brand h-3 w-3" strokeWidth={2} />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      disabled={isPending}
                      onClick={() => onAddColumn("STATUS")}
                      className="bg-[#A2ABBD59] hover:bg-[#A2ABBD59] text-[#576070] hover:text-[#576070] w-full">
                      <svg
                        width="13"
                        height="11"
                        viewBox="0 0 13 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect
                          x="0.306719"
                          y="0.306719"
                          width="11.6553"
                          height="2.45375"
                          rx="0.715677"
                          stroke="#576070"
                          stroke-width="0.613437"
                        />
                        <rect
                          x="0.306719"
                          y="4.08968"
                          width="11.6553"
                          height="2.45375"
                          rx="0.715677"
                          stroke="#576070"
                          stroke-width="0.613437"
                        />
                        <rect
                          x="0.306719"
                          y="7.87239"
                          width="11.6553"
                          height="2.45375"
                          rx="0.715677"
                          stroke="#576070"
                          stroke-width="0.613437"
                        />
                      </svg>
                      Status
                    </Button>
                    <Button
                      disabled={isPending}
                      onClick={() => onAddColumn("PERSON")}
                      className="bg-[#A2ABBD59] hover:bg-[#A2ABBD59] text-[#576070] hover:text-[#576070] w-full">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5.90717 5.06247C5.21125 5.06247 4.61519 4.81437 4.11899 4.31817C3.62278 3.82196 3.37496 3.22618 3.37553 2.53083C3.37609 1.83547 3.62391 1.23912 4.11899 0.741796C4.61406 0.244468 5.21013 -0.00278921 5.90717 2.37312e-05C6.60422 0.00283667 7.20028 0.250375 7.69536 0.742639C8.19044 1.2349 8.43826 1.83125 8.43882 2.53167C8.43938 3.23209 8.19156 3.82787 7.69536 4.31901C7.19916 4.81015 6.60309 5.05741 5.90717 5.06247ZM0 10.2886V9.77555C0 9.42731 0.101266 9.10157 0.303798 8.79834C0.506892 8.49454 0.779747 8.25881 1.12236 8.09116C1.91899 7.70917 2.71617 7.42281 3.51392 7.23209C4.31111 7.04081 5.10886 6.94517 5.90717 6.94517C6.70548 6.94517 7.50352 7.04081 8.30126 7.23209C9.09901 7.42337 9.89564 7.70973 10.6911 8.09116C11.0343 8.25881 11.3072 8.49454 11.5097 8.79834C11.7128 9.10157 11.8143 9.42731 11.8143 9.77555V10.2886C11.8143 10.5362 11.7302 10.7443 11.562 10.9131C11.3938 11.0808 11.1857 11.1646 10.9376 11.1646H0.877637C0.629536 11.1646 0.421378 11.0805 0.253165 10.9123C0.0849509 10.744 0.000562588 10.5367 0 10.2886ZM0.843882 10.3207H10.9705V9.77471C10.9705 9.58793 10.91 9.41212 10.789 9.24728C10.6686 9.083 10.5018 8.94405 10.2886 8.8304C9.59437 8.49398 8.8782 8.23631 8.14008 8.05741C7.40197 7.8785 6.65766 7.78905 5.90717 7.78905C5.15668 7.78905 4.41238 7.8785 3.67426 8.05741C2.93615 8.23631 2.21997 8.49398 1.52574 8.8304C1.31195 8.94405 1.14515 9.083 1.02532 9.24728C0.90436 9.41212 0.843882 9.58821 0.843882 9.77555V10.3207ZM5.90717 4.21859C6.37131 4.21859 6.76878 4.05319 7.09958 3.72239C7.43038 3.39158 7.5955 2.99412 7.59494 2.52998C7.59437 2.06585 7.42925 1.66866 7.09958 1.33842C6.7699 1.00818 6.37243 0.84278 5.90717 0.842218C5.44191 0.841655 5.04473 1.00706 4.71561 1.33842C4.3865 1.66978 4.2211 2.06697 4.21941 2.52998C4.21772 2.99299 4.38312 3.39046 4.71561 3.72239C5.0481 4.05431 5.44529 4.21943 5.90717 4.21774"
                          fill="#576070"
                        />
                      </svg>
                      Personne
                    </Button>
                    <Button
                      disabled={isPending}
                      onClick={() => onAddColumn("DATE")}
                      className="bg-[#A2ABBD59] hover:bg-[#A2ABBD59] text-[#576070] hover:text-[#576070] w-full">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10.7068 11.8142H1.10759C0.494726 11.8142 0 11.3195 0 10.7066V1.84588C0 1.23301 0.494726 0.738281 1.10759 0.738281H10.7068C11.3196 0.738281 11.8143 1.23301 11.8143 1.84588V10.7066C11.8143 11.3195 11.3196 11.8142 10.7068 11.8142ZM1.10759 1.47668C0.900844 1.47668 0.738397 1.63913 0.738397 1.84588V10.7066C0.738397 10.9134 0.900844 11.0758 1.10759 11.0758H10.7068C10.9135 11.0758 11.0759 10.9134 11.0759 10.7066V1.84588C11.0759 1.63913 10.9135 1.47668 10.7068 1.47668H1.10759Z"
                          fill="#576070"
                        />
                        <path
                          d="M3.32278 2.95359C3.11603 2.95359 2.95359 2.79114 2.95359 2.58439V0.369198C2.95359 0.162447 3.11603 0 3.32278 0C3.52954 0 3.69198 0.162447 3.69198 0.369198V2.58439C3.69198 2.79114 3.52954 2.95359 3.32278 2.95359ZM8.49156 2.95359C8.28481 2.95359 8.12236 2.79114 8.12236 2.58439V0.369198C8.12236 0.162447 8.28481 0 8.49156 0C8.69831 0 8.86076 0.162447 8.86076 0.369198V2.58439C8.86076 2.79114 8.69831 2.95359 8.49156 2.95359ZM11.4451 4.43038H0.369198C0.162447 4.43038 0 4.26793 0 4.06118C0 3.85443 0.162447 3.69198 0.369198 3.69198H11.4451C11.6519 3.69198 11.8143 3.85443 11.8143 4.06118C11.8143 4.26793 11.6519 4.43038 11.4451 4.43038Z"
                          fill="#576070"
                        />
                      </svg>
                      Date
                    </Button>
                    <Button
                      disabled={isPending}
                      onClick={() => onAddColumn("TEXT")}
                      className="bg-[#A2ABBD59] hover:bg-[#A2ABBD59] text-[#576070] hover:text-[#576070] w-full">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.2032 2.08857V0.56958H0.570312V2.08857M5.88677 0.56958V11.2025M5.88677 11.2025H4.36778M5.88677 11.2025H7.40576"
                          stroke="#576070"
                          stroke-width="1.13924"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      Text
                    </Button>
                  </div>
                </PopoverContent>
              </Popover> */}
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
          tissues={[]}
          isFetchingVariants={isFetchingVariants}
          workShops={workShops}
          clients={[]}
          key={productionToEdit?.id}
          addProductionOptimistic={(item) =>
            manageProductionOptimistic({ type: "ADD", item })
          }
          updateProductionOptimistic={(item) =>
            manageProductionOptimistic({
              type: "updateProduction",
              production: item,
            })
          }
        />
      ) : (
        <ProductionsTable
          productions={productions}
          orderStages={orderStages}
          employees={[]}
          onClick={(item) => {
            setProductionToEdit(item);
            setIsAdd(true);
          }}
          onSubOrderClick={(item) => {
            setMotherOrder(item);
            setIsAdd(true);
          }}
          columns={columns}
          updateStageOptimistic={(stage, idx) =>
            manageProductionOptimistic({ type: "updateStage", idx, stage })
          }
          manageEmployeeOptimistic={(employee, role, idx, action) =>
            manageProductionOptimistic({
              type: "addEmployee",
              employee,
              role,
              idx,
              action,
            })
          }
        />
      )}
    </div>
  );
}

export default ProductionInterface;
