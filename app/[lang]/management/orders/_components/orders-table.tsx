"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { badgeVariant } from "@/constants/badge-var";
import { truncate } from "@/lib/truncate";
import { cn } from "@/lib/utils";
import { OrderInTable } from "@/types/types";
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

export function OrdersTable({
  orders,
  currentPage,
  ordersPerPage,
  searchParams,
  totalOrders,
}: Props) {
  const router = useRouter();

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
            <TableHead className="text-[#64748B] font-normal p-5">
              Client
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
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
              Temp
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Note
            </TableHead>
            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={index} className="border-border hover:bg-muted/30">
              <TableCell className="p-5">
                <div className="flex items-center justify-start">
                  <div className="rounded-full flex items-center justify-center px-5 py-1.5 w-fit border border-[#95A1B14F] text-[#182233]">
                    {order.client?.name || order.guest?.name}
                  </div>
                </div>
              </TableCell>
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
              <TableCell className="text-[#95A1B1] text-center">
                {order.subType.name}
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {order.tissu?.name}
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {order.orderId}
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center text-sm whitespace-pre-line">
                <div className="space-y-1 text-[#95A1B1]">
                  <h5 className="text-sm">
                    {format(order.createdAt, "HH:mm")}
                  </h5>
                  <h5 className="text-sm">
                    {format(order.createdAt, "dd/MM/yyyy")}
                  </h5>
                </div>
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {truncate(order.note || "-", 15)}
              </TableCell>
              <TableCell>
                {order.status === "ACCEPTED" ? (
                  <Badge variant={"green"} className="px-3 py-2">
                    Accepted
                  </Badge>
                ) : order.status === "REJECTED" ? (
                  <Badge variant={"red"} className="px-3 py-2">
                    Rejected
                  </Badge>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full p-0 bg-[#21D954]/20 hover:bg-[#21D954]/30 text-[#21D954] hover:text-[#21D954]"
                      onClick={() => {}}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full p-0 bg-[#BA0000]/20 hover:bg-[#BA0000]/30 text-[#BA0000] hover:text-[#BA0000]"
                      onClick={() => {}}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
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
