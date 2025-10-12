"use client";

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
import { ProductionInTable, UserWithWorkshop } from "@/types/types";
import { format } from "date-fns";
import Image from "next/image";
import { fr } from "date-fns/locale";
import { OrderStage } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useTransition } from "react";
import { addOrderStage } from "@/actions/mutations/order/add-order-stage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { updateOrderStage } from "@/actions/mutations/order/update-order-stage";
import { useRouter } from "next/navigation";
import qs from "query-string";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProductionDetails from "./production-details";

interface Props {
  productions: ProductionInTable[];
  orderStages: OrderStage[];
  onClick: (production: ProductionInTable) => void;
  currentPage: number;
  totalProductions: number;
  productionsPerPage: number;
  searchParams: Record<string, string | string[] | undefined>;
  employees: UserWithWorkshop[];
}

export function ProductionsTable({
  productions,
  onClick,
  orderStages,
  currentPage,
  productionsPerPage,
  totalProductions,
  searchParams,
  employees,
}: Props) {
  const [newOrderStageInput, setNewOrderStageInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [isAddingOrderStagePending, startAddingOrderStage] = useTransition();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const totalPages = Math.ceil(totalProductions / productionsPerPage);

  const { page, ...rest } = searchParams;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const url = qs.stringifyUrl(
        {
          url: "/management/production",
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
          url: "/management/production",
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

  const handleAddOrderStage = () => {
    startAddingOrderStage(() => {
      addOrderStage(newOrderStageInput)
        .then(() => {
          setNewOrderStageInput("");
          setShowAdd(false);
          toast.success("created !");
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-[#64748B] font-normal p-5">
              Atelier
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Production
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Type
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Tissus
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Statut
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Client
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Création
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              ID
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productions.map((order) => (
            <Sheet key={order.id}>
              <SheetTrigger asChild>
                <TableRow className="border-border hover:bg-muted/30 cursor-pointer">
                  <TableCell className="p-5">
                    <div className="flex items-start justify-start gap-1.5">
                      <Image
                        alt="workshop"
                        src={order.workShop?.image || "/workshop2.svg"}
                        width={25}
                        height={25}
                        className="rounded-lg object-cover"
                      />
                      <h1>{order.workShop?.name}</h1>
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
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Popover>
                        <PopoverTrigger
                          onClick={(e) => {
                            e.stopPropagation();
                          }}>
                          <div
                            style={{
                              backgroundColor: `${order.orderStage?.color}33`,
                              color: `${order.orderStage?.color}`,
                            }}
                            className="px-3 py-1.5 rounded-[3.96px] font-medium text-xs">
                            {order.orderStage?.name}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-fit">
                          <div className="space-y-2">
                            <div className="space-y-1">
                              {orderStages.map((stage) => (
                                <div className="px-4 pt-3 flex items-center justify-center">
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startTransition(() => {
                                        toast.loading("mise a jour...", {
                                          id: "loading",
                                        });
                                        updateOrderStage({
                                          orderId: order.id,
                                          orderStageId: stage.id,
                                        })
                                          .then(() => {
                                            toast.success("Success !");
                                          })
                                          .catch(() => toast.error("Erreur ."))
                                          .finally(() =>
                                            toast.dismiss("loading")
                                          );
                                      });
                                    }}
                                    style={{
                                      backgroundColor: `${stage?.color}33`,
                                      color: `${stage?.color}`,
                                    }}
                                    className="px-3 py-1.5 rounded-[3.96px] font-medium text-xs cursor-pointer w-full max-w-32 flex items-center justify-center">
                                    {stage?.name}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="px-4 pb-2">
                              {showAdd ? (
                                <Input
                                  className="mb-2"
                                  disabled={isAddingOrderStagePending}
                                  type="text"
                                  placeholder="ex: en cours.."
                                  value={newOrderStageInput}
                                  onChange={(e) =>
                                    setNewOrderStageInput(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault(); // Prevent form submission on Enter for this input
                                      handleAddOrderStage();
                                    }
                                  }}
                                />
                              ) : (
                                <Button
                                  type="button"
                                  onClick={() => setShowAdd(true)}
                                  variant="brand_link"
                                  className="!p-0">
                                  <Plus className="h-4 w-4" />
                                  Ajouter Etat
                                </Button>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div className="rounded-full flex items-center justify-center px-5 py-1.5 w-fit border border-[#95A1B14F] text-[#182233]">
                        {order.client?.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={`https://${
                            process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME
                          }/
                      
                      ${
                        //@ts-ignore
                        order?.user?.image?.id
                      }`}
                        />
                        <AvatarFallback className="text-xs text-white bg-brand">
                          {order.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-[#95A1B1]">
                        {format(order.acceptedAt || new Date(), "d MMM", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#95A1B1] text-center">
                    {order.orderId}
                  </TableCell>
                </TableRow>
              </SheetTrigger>
              <SheetContent showX={false}>
                <ProductionDetails
                  onClick={() => onClick(order)}
                  orderStages={orderStages}
                  employees={employees}
                  order={order}
                />
              </SheetContent>
            </Sheet>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col md:!flex-row md:!items-center justify-between gap-4 p-5">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * productionsPerPage + 1} to{" "}
          {Math.min(currentPage * productionsPerPage, totalProductions)} of{" "}
          {totalProductions} entries
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
                url: "/management/production",
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
