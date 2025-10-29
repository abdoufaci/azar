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
import { useState, useTransition } from "react";
import { DesksTable } from "./desk-table";
import { Separator } from "@/components/ui/separator";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  currentPage: number;
  totalDesks: number;
  desksPerPage: number;
  desks: Desk[];
  todaysDeposits: number;
  todaysWithdrawals: number;
  total: number;
}

function DeskInterface({
  searchParams,
  currentPage,
  desks,
  desksPerPage,
  totalDesks,
  todaysDeposits,
  todaysWithdrawals,
  total,
}: Props) {
  const [isAdd, setIsAdd] = useState(false);
  const [deskToEdit, setDeskToEdit] = useState<Desk | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <h1 className="text-brand text-sm font-medium">
          <span className="text-xs text-black font-normal">Date </span>{" "}
          {new Date().toLocaleDateString()}
        </h1>
        <div className="flex items-center gap-3">
          <div className="space-y-0.5">
            <h3 className="text-[#182233] font-medium text-sm">Caisse</h3>
            <h1 className="text-2xl text-brand font-semibold">{total} da</h1>
          </div>
          <Separator
            orientation="horizontal"
            className="!h-16 !w-[1px] !max-w-[1px] !min-w-[1px] bg-[#A2ABBD]"
          />
          <div className="space-y-0.5">
            <h3 className="text-[#182233] font-medium text-sm">Entrée</h3>
            <h1 className="text-2xl text-brand font-semibold">
              {todaysDeposits} da
            </h1>
          </div>
          <Separator
            orientation="horizontal"
            className="!h-16 !w-[1px] !max-w-[1px] !min-w-[1px] bg-[#A2ABBD]"
          />
          <div className="space-y-0.5">
            <h3 className="text-[#182233] font-medium text-sm">Sortie</h3>
            <h1 className="text-2xl text-brand font-semibold">
              -{todaysWithdrawals} da
            </h1>
          </div>
        </div>
      </div>
      {!isAdd && (
        <div className="flex items-center justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-4 flex-1">
            <Button
              onClick={() => setIsAdd(true)}
              variant={"brand"}
              className="px-4">
              Ajouter
            </Button>
            <SearchFilter
              url={"/management/stock"}
              searchParams={searchParams}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DeskTypeFilter
              url={"/management/stock"}
              searchParams={searchParams}
            />
            <DateFilter url={"/management/stock"} searchParams={searchParams} />
          </div>
        </div>
      )}
      {isAdd ? (
        <ManageDeskForm
          onCancel={() => {
            setIsAdd(false);
            setDeskToEdit(null);
          }}
          desk={deskToEdit}
        />
      ) : (
        <DesksTable
          currentPage={currentPage}
          desks={desks}
          desksPerPage={desksPerPage}
          searchParams={searchParams}
          totalDesks={totalDesks}
          onEdit={(desk) => {
            setIsAdd(true);
            setDeskToEdit(desk);
          }}
        />
      )}
    </div>
  );
}

export default DeskInterface;
