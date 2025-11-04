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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { addStockType } from "@/actions/mutations/stock/add-stock-type";
import { updateStockDisponibility } from "@/actions/mutations/demand/update-stock-disponibility";
import { updateStockQty } from "@/actions/mutations/stock/update-qty-stock";
import { ConfirmEditDeskModal } from "@/components/modals/confirm-edit-desk-modal";

interface Props {
  currentPage: number;
  totalDesks: number;
  desksPerPage: number;
  searchParams: Record<string, string | string[] | undefined>;
  desks: Desk[];
  url?: string;
  onEdit: (item: Desk) => void;
}

export function DesksTable({
  currentPage,
  desksPerPage,
  searchParams,
  totalDesks,
  desks,
  url = "/management/stock",
  onEdit,
}: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState("");

  const totalPages = Math.ceil(totalDesks / desksPerPage);

  const { page, ...rest } = searchParams;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const path = qs.stringifyUrl(
        {
          url,
          query: {
            page: currentPage + 1,
            ...rest,
          },
        },
        { skipNull: true }
      );
      router.push(path);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const path = qs.stringifyUrl(
        {
          url,
          query: {
            page: currentPage === 2 ? null : currentPage - 1,
            ...rest,
          },
        },
        { skipNull: true }
      );
      router.push(path);
    }
  };

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
          {desks.map((desk, idx) => (
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
                {desk.type === "DEPOSIT" ? "+" : "-"}
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
                {desk.createdAt.toLocaleDateString()}
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
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col md:!flex-row md:!items-center justify-between gap-4 p-5">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * desksPerPage + 1} to{" "}
          {Math.min(currentPage * desksPerPage, totalDesks)} of {totalDesks}{" "}
          entries
        </div>
        <div className="flex flex-wrap items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="border-[#B9BEC7] hover:bg-gray-800">
            Previous
          </Button>
          {Array.from(Array(totalPages).keys()).map((_, idx) => {
            const path = qs.stringifyUrl(
              {
                url,
                query: {
                  page: idx === 0 ? null : idx + 1,
                  ...rest,
                },
              },
              { skipNull: true }
            );

            return (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className={cn(
                  "",
                  idx + 1 === currentPage
                    ? "bg-brand border-brand hover:bg-brand/90 text-white hover:text-white"
                    : "border-[#B9BEC7] hover:bg-gray-800"
                )}
                asChild>
                <Link href={path}>{idx + 1}</Link>
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="border-[#B9BEC7] hover:bg-gray-800">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
