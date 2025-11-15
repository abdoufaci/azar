import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { badgeVariant } from "@/constants/badge-var";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import qs from "query-string";
import { DemandInTable, StockInTable } from "@/types/types";
import { truncate } from "@/lib/truncate";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DemandStage, Desk } from "@prisma/client";
import { addDemandStage } from "@/actions/mutations/demand/add-demand-stage";
import { updateDemandStage } from "@/actions/mutations/demand/update-demand-stage";
import { PenLine, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import {
  FetchNextPageOptions,
  FetchPreviousPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { ConfirmEditDeskModal } from "@/components/modals/confirm-edit-desk-modal";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
  fetchPreviousPage: (
    options?: FetchPreviousPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  tanstackIsPending: boolean;
  data: InfiniteData<any, unknown> | undefined;
  desks: Desk[];
  url?: string;
  onEdit: (item: Desk) => void;
}

export function DesksTable({
  desks,
  onEdit,
  data,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  isFetchingNextPage,
  tanstackIsPending,
}: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState("");
  const [isFetchingPreviousPage, setIsFetchingPreviousPage] = useState(false);
  let currentDesks = data;

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-[#64748B] font-normal p-5">
              Nom
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Montant
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Type
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Date
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Ref
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetchingNextPage || isFetchingPreviousPage || tanstackIsPending ? (
            <>
              <DesksTable.Skeleton />
              <DesksTable.Skeleton />
              <DesksTable.Skeleton />
              <DesksTable.Skeleton />
              <DesksTable.Skeleton />
              <DesksTable.Skeleton />
              <DesksTable.Skeleton />
              <DesksTable.Skeleton />
            </>
          ) : (
            desks.map((desk, idx) => (
              <TableRow
                key={desk.id}
                className="border-border hover:bg-muted/30 cursor-pointer group">
                <ConfirmEditDeskModal
                  isOpen={isOpen === desk.id}
                  onClose={() => setIsOpen("")}
                  onContinue={() => onEdit(desk)}
                />
                <TableCell className="text-[#95A1B1] text-center">
                  {desk.name}
                </TableCell>
                <TableCell className="text-[#95A1B1] text-center">
                  {desk.type === "DEPOSIT" && "+"}
                  {desk.amount}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <div
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-medium",
                        desk.type === "DEPOSIT"
                          ? "text-[#056BE4] bg-[#DEEDFF]"
                          : "text-[#7C05E4] bg-[#7C05E426]"
                      )}>
                      {desk.type === "DEPOSIT" ? "Entrée" : "Sortie"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-[#95A1B1] text-center">
                  {format(desk.createdAt, "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-[#95A1B1] text-center">
                  <div className="flex items-center justify-center gap-5">
                    <h5>{desk.ref}</h5>
                    <PenLine
                      onClick={() => setIsOpen(desk.id)}
                      className="text-white cursor-pointer h-3 w-3 group-hover:text-[#576070] block"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-5 w-full mt-3 p-5">
        <Button
          className={cn(
            "rounded-md",
            !!currentDesks?.pages.length && currentDesks?.pages.length <= 1
              ? "text-black"
              : "text-white"
          )}
          variant={
            !!currentDesks?.pages.length && currentDesks?.pages.length <= 1
              ? "ghost"
              : "brand"
          }
          disabled={
            !!currentDesks?.pages.length && currentDesks?.pages.length <= 1
          }
          onClick={() => {
            setIsFetchingPreviousPage(true);
            fetchPreviousPage();
            currentDesks?.pages.length &&
              currentDesks?.pages.length > 1 &&
              currentDesks?.pages.pop();
            setIsFetchingPreviousPage(false);
          }}>
          Prev
        </Button>
        <Button
          variant={hasNextPage ? "brand" : "ghost"}
          className={cn(
            "rounded-md",
            hasNextPage ? "text-white" : "text-black"
          )}
          disabled={!hasNextPage}
          onClick={() => fetchNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}

DesksTable.Skeleton = function DesksTable() {
  return (
    <TableRow className="text-[#757575]">
      <TableCell className="text-black font-semibold flex items-center space-x-2 p-5">
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell className="font-medium text-center">
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="w-28 h-5" />
      </TableCell>
    </TableRow>
  );
};
