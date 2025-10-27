"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { badgeVariant } from "@/constants/badge-var";
import { useModal } from "@/hooks/use-modal-store";
import { truncate } from "@/lib/truncate";
import { cn } from "@/lib/utils";
import {
  OrderInTable,
  OrderWithRelations,
  ProductionInTable,
} from "@/types/types";
import { WorkShop } from "@prisma/client";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  orders: OrderInTable[];
  currentPage: number;
  totalOrders: number;
  ordersPerPage: number;
  searchParams: Record<string, string | string[] | undefined>;
}

export function ClientOrdersTable({
  orders,
  currentPage,
  ordersPerPage,
  searchParams,
  totalOrders,
}: Props) {
  const router = useRouter();
  const { onOpen } = useModal();

  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const { page, ...rest } = searchParams;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const url = qs.stringifyUrl(
        {
          url: "/management/orders",
          query: {
            page: currentPage + 1,
            ...rest,
          },
        },
        { skipNull: true }
      );
      router.push(url);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const url = qs.stringifyUrl(
        {
          url: "/management/orders",
          query: {
            page: currentPage === 2 ? null : currentPage - 1,
            ...rest,
          },
        },
        { skipNull: true }
      );
      router.push(url);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-[#64748B] font-normal text-center p-4">
              Salon
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Type
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Tissus
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              ID
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={index} className="border-border hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center justify-center">
                  <div
                    style={{
                      backgroundColor: `${order.variant.color}33`,
                      color: `${order.variant.color}`,
                    }}
                    className="rounded-full px-4 py-1.5 text-xs font-medium">
                    {order.variant.name}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center p-4">
                {order.subType.name}
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {order.tissu?.name}
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {order.orderId}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <div
                    style={{
                      backgroundColor:
                        order.status === "ACCEPTED"
                          ? order.orderStage?.name === "Fini"
                            ? "#1E78FF33"
                            : `${order.orderStage?.color}33`
                          : order.status === "PENDING"
                          ? "#A2ABBD59"
                          : "#CE2A2A33",
                      color:
                        order.status === "ACCEPTED"
                          ? order.orderStage?.name === "Fini"
                            ? "#1E78FF33"
                            : `${order.orderStage?.color}`
                          : order.status === "PENDING"
                          ? "#576070"
                          : "#CE2A2A",
                    }}
                    className="px-3 py-1.5 rounded-[3.96px] font-medium text-xs">
                    {order.status === "ACCEPTED"
                      ? order.orderStage?.name === "Fini"
                        ? "En Cours..."
                        : order.orderStage?.name
                      : order.status === "PENDING"
                      ? "En Attente"
                      : "Refusé"}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col md:!flex-row md:!items-center justify-between gap-4 p-5">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * ordersPerPage + 1} to{" "}
          {Math.min(currentPage * ordersPerPage, totalOrders)} of {totalOrders}{" "}
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
            const url = qs.stringifyUrl(
              {
                url: "/management/orders",
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
                <Link href={url}>{idx + 1}</Link>
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
