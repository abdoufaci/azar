"use client";

import { DateFilter } from "@/components/filters/date-filter";
import DeskTypeFilter from "@/components/filters/dest-type-filter";
import SearchFilter from "@/components/filters/search-filter";
import StockStatusFilter from "@/components/filters/stock-status-filter";
import StockTypeFilter from "@/components/filters/stock-type-filter";
import WorkShopFilter from "@/components/filters/workshop-filter";
import ManageDeskForm from "@/components/forms/manage-desk-form";
import { Button } from "@/components/ui/button";
import { Desk, StockType, WorkShop } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { DesksTable } from "./desk-table";
import { Separator } from "@/components/ui/separator";
import { useDesksQuery } from "@/hooks/admin/use-query-desks";
import { deskOptimisticReducer } from "@/lib/optimistic-reducers/desk-optimistic-reducer";
import { useWareHousesQuery } from "@/hooks/use-ware-houses-query";
import { useSuppliersQuery } from "@/hooks/use-suppliers-query";
import WareHouseFilter from "@/components/filters/ware-house-filter";
import SupplierFilter from "@/components/filters/supplier-filter";
import { OpenDialogButton } from "@/components/open-dialog-button";
import { SupplyInTable } from "@/types/types";
import { useSuppliesQuery } from "@/hooks/admin/use-query-supplies";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";

interface Props {}

function SupplyInterface({}: Props) {
  const [supplies, setSupplies] = useState<SupplyInTable[]>([]);
  const [Buttonref, ButtonInView] = useInView();
  const [isPending, startTransition] = useTransition();

  const { data: warehouses, isPending: isFetchingWareHouses } =
    useWareHousesQuery();
  const { data: suppliers, isPending: isFetchingSuppliers } =
    useSuppliersQuery();
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isFetchingSupplies,
  } = useSuppliesQuery();

  useEffect(() => {
    setSupplies(data?.pages[data?.pages?.length - 1]?.supplies || []);
  }, [data]);

  useEffect(() => {
    if (ButtonInView) {
      fetchNextPage();
    }
  }, [ButtonInView]);

  const generateInvoice = async (supply: SupplyInTable) => {
    startTransition(async () => {
      toast.loading("en cour....", { id: "loading" });
      try {
        const response = await axios.post(
          "https://server-xjlv.onrender.com/bon-livraison-fourniseur",
          {
            from: supply.supplier.name,
            to: supply.warehouse.name,
            date: format(supply.createdAt, "dd-MM-yyyy"),
            time: format(supply.createdAt, "HH:mm"),
            items: supply.products.map((product) => ({
              name: product.name,
              unitPrice: product.unitPrice,
              quantity: product.quantity,
            })),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhemFyLWRldmVsb3BlcnMiLCJpc3MiOiJodHRwczovL3NlcnZlci14amx2Lm9ucmVuZGVyLmNvbSIsImlkIjoiYXphckRldmVsb3BlcnMifQ.K3U8pcye9g4W6KpCPKEcdRbY2L5QlOW5P6g1DGO3Trk",
            },
            responseType: "arraybuffer",
          }
        );

        // Example: download PDF in browser
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.pdf";
        a.click();
        URL.revokeObjectURL(url);

        console.log("PDF downloaded successfully.");
      } catch (error: any) {
        console.log({ error });
      } finally {
        toast.dismiss("loading");
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-5 flex-wrap">
        <div className="flex items-center gap-4 flex-1">
          <OpenDialogButton
            title="ajouter une transaction"
            type="manageSupply"
            data={{
              warehouses,
              suppliers,
              onAddSupply(item) {
                setSupplies((prev) => [item, ...prev]);
              },
            }}
          />
          <SearchFilter />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DateFilter />
          <WareHouseFilter
            wareHouses={warehouses}
            isPending={isFetchingWareHouses}
          />
          <SupplierFilter
            suppliers={suppliers}
            isPending={isFetchingSuppliers}
          />
        </div>
      </div>
      {isFetchingSupplies ? (
        <div className="flex flex-col items-center gap-4">
          <SupplyInterface.Skelton />
          <SupplyInterface.Skelton />
          <SupplyInterface.Skelton />
          <SupplyInterface.Skelton />
          <SupplyInterface.Skelton />
          <SupplyInterface.Skelton />
          <SupplyInterface.Skelton />
          <SupplyInterface.Skelton />
          <SupplyInterface.Skelton />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {supplies.map((supply) => (
            <div
              key={supply.id}
              className="w-full rounded-[8px] border border-[#E7F1F8] p-3 flex items-center justify-between text-sm">
              <h1 className="text-[#95A1B1] font-medium">{supply.ref}</h1>
              <h1 className="text-[#576070] font-medium">
                {supply.products.length} Produits
              </h1>
              <h1 className="text-[#576070] font-medium">
                <span className="text-[#A2ABBD] font-normal">Depuis</span>{" "}
                {supply.supplier.name}{" "}
                <span className="text-[#A2ABBD] font-normal">à</span>{" "}
                {supply.warehouse.name}
              </h1>
              <h1 className="text-[#95A1B1] font-medium">
                {format(supply.createdAt, "dd/MM/yyyy HH:mm")}
              </h1>
              <h1 className="text-[#95A1B1] font-medium">
                {supply.products.reduce(
                  (acc, item) => acc + item.quantity * item.unitPrice,
                  0
                )}
                da
              </h1>
              <svg
                className="cursor-pointer"
                onClick={() => generateInvoice(supply)}
                width="16"
                height="20"
                viewBox="0 0 16 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 0L8.117 0.00699997C8.34022 0.0333238 8.54806 0.134079 8.70699 0.293011C8.86592 0.451943 8.96668 0.659783 8.993 0.883L9 1V5L9.005 5.15C9.04078 5.62617 9.24576 6.07383 9.58286 6.41203C9.91996 6.75023 10.3669 6.95666 10.843 6.994L11 7H15L15.117 7.007C15.3402 7.03332 15.5481 7.13408 15.707 7.29301C15.8659 7.45194 15.9667 7.65978 15.993 7.883L16 8V17C16 17.7652 15.7077 18.5015 15.1827 19.0583C14.6578 19.615 13.9399 19.9501 13.176 19.995L13 20H3C2.23479 20 1.49849 19.7077 0.941739 19.1827C0.384993 18.6578 0.0498925 17.9399 0.00500012 17.176L4.66045e-09 17V3C-4.26217e-05 2.23479 0.292325 1.49849 0.817284 0.941739C1.34224 0.384993 2.06011 0.0498925 2.824 0.00500011L3 0H8ZM12 15H10C9.73478 15 9.48043 15.1054 9.29289 15.2929C9.10536 15.4804 9 15.7348 9 16C9 16.2652 9.10536 16.5196 9.29289 16.7071C9.48043 16.8946 9.73478 17 10 17H12C12.2652 17 12.5196 16.8946 12.7071 16.7071C12.8946 16.5196 13 16.2652 13 16C13 15.7348 12.8946 15.4804 12.7071 15.2929C12.5196 15.1054 12.2652 15 12 15ZM12 11H4C3.73478 11 3.48043 11.1054 3.29289 11.2929C3.10536 11.4804 3 11.7348 3 12C3 12.2652 3.10536 12.5196 3.29289 12.7071C3.48043 12.8946 3.73478 13 4 13H12C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11ZM5 4H4C3.73478 4 3.48043 4.10536 3.29289 4.29289C3.10536 4.48043 3 4.73478 3 5C3 5.26522 3.10536 5.51957 3.29289 5.70711C3.48043 5.89464 3.73478 6 4 6H5C5.26522 6 5.51957 5.89464 5.70711 5.70711C5.89464 5.51957 6 5.26522 6 5C6 4.73478 5.89464 4.48043 5.70711 4.29289C5.51957 4.10536 5.26522 4 5 4Z"
                  fill="#1E78FF"
                />
                <path
                  d="M15.001 5.00002H11.001L11 0.999023L15.001 5.00002Z"
                  fill="#1E78FF"
                />
              </svg>
            </div>
          ))}
        </div>
      )}
      {hasNextPage && (
        <div className="flex justify-center w-full">
          {isFetchingNextPage ? (
            <div className="flex flex-col items-center gap-4">
              <SupplyInterface.Skelton />
              <SupplyInterface.Skelton />
              <SupplyInterface.Skelton />
              <SupplyInterface.Skelton />
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
    </div>
  );
}

export default SupplyInterface;

SupplyInterface.Skelton = function SkeltonTravel() {
  return <Skeleton className="h-12 w-full" />;
};
