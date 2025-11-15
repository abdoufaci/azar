"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { OrderStatus, WorkShop } from "@prisma/client";
import {
  FetchNextPageOptions,
  FetchPreviousPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";

interface Props {
  orders: OrderInTable[];
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
  onUpdateStatus: (idx: number, status: OrderStatus) => void;
}

export function OrdersTable({
  orders,
  data,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  isFetchingNextPage,
  tanstackIsPending,
  onUpdateStatus,
}: Props) {
  const router = useRouter();
  const { onOpen } = useModal();
  const [isFetchingPreviousPage, setIsFetchingPreviousPage] = useState(false);

  let currentOrders = data;

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
          {isFetchingNextPage || isFetchingPreviousPage || tanstackIsPending ? (
            <>
              <OrdersTable.Skeleton />
              <OrdersTable.Skeleton />
              <OrdersTable.Skeleton />
              <OrdersTable.Skeleton />
              <OrdersTable.Skeleton />
              <OrdersTable.Skeleton />
              <OrdersTable.Skeleton />
              <OrdersTable.Skeleton />
            </>
          ) : (
            orders.map((order, index) => (
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
                  <HoverCard>
                    <HoverCardTrigger>
                      {truncate(order.note || "-", 15)}
                    </HoverCardTrigger>
                    <HoverCardContent className="w-full">
                      <p className="w-full max-w-sm font-medium text-left">
                        {order.note}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
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
                        onClick={() =>
                          onOpen("acceptOrder", {
                            order,
                            onUpdateOrderStatus: () =>
                              onUpdateStatus(index, "ACCEPTED"),
                          })
                        }>
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
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-5 w-full mt-3 p-5">
        <Button
          className={cn(
            "rounded-md",
            !!currentOrders?.pages.length && currentOrders?.pages.length <= 1
              ? "text-black"
              : "text-white"
          )}
          variant={
            !!currentOrders?.pages.length && currentOrders?.pages.length <= 1
              ? "ghost"
              : "brand"
          }
          disabled={
            !!currentOrders?.pages.length && currentOrders?.pages.length <= 1
          }
          onClick={() => {
            setIsFetchingPreviousPage(true);
            fetchPreviousPage();
            currentOrders?.pages.length &&
              currentOrders?.pages.length > 1 &&
              currentOrders?.pages.pop();
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
OrdersTable.Skeleton = function SkeletonOrdersTable() {
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
      <TableCell className="text-right">
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="w-28 h-5" />
      </TableCell>
    </TableRow>
  );
};
