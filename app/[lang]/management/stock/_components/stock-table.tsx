import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import qs from "query-string";
import { StockInTable } from "@/types/types";
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
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { addStockType } from "@/actions/mutations/stock/add-stock-type";
import { updateStockDisponibility } from "@/actions/mutations/demand/update-stock-disponibility";
import { updateStockQty } from "@/actions/mutations/stock/update-qty-stock";
import {
  FetchNextPageOptions,
  FetchPreviousPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { StockDisponibility } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  stocks: StockInTable[];
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
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<InfiniteData<any, unknown>, Error>>;
  updateStockQuantityOptimistic: (quantity: number, idx: number) => void;
  updateStockDisponibilityOptimistic: (
    disponibility: StockDisponibility,
    idx: number
  ) => void;
}

export function StocksTable({
  stocks,
  data,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  isFetchingNextPage,
  tanstackIsPending,
  updateStockDisponibilityOptimistic,
  updateStockQuantityOptimistic,
  refetch,
}: Props) {
  const [newStockTypeInput, setNewStockTypeInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [isAddingStockTypePending, startAddingStockType] = useTransition();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);

  const [isFetchingPreviousPage, setIsFetchingPreviousPage] = useState(false);

  let currentStocks = data;

  const handleAddStockType = () => {
    startAddingStockType(() => {
      addStockType(newStockTypeInput)
        .then(() => {
          setNewStockTypeInput("");
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
              Produit
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Disponiblité
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Quantité
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Type
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Dépôt
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Ref
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetchingNextPage || isFetchingPreviousPage || tanstackIsPending ? (
            <>
              <StocksTable.Skeleton />
              <StocksTable.Skeleton />
              <StocksTable.Skeleton />
              <StocksTable.Skeleton />
              <StocksTable.Skeleton />
              <StocksTable.Skeleton />
              <StocksTable.Skeleton />
              <StocksTable.Skeleton />
            </>
          ) : (
            stocks.map((stock, idx) => (
              <TableRow
                key={stock.id}
                className="border-border hover:bg-muted/30 cursor-pointer">
                <TableCell className="text-[#576070] p-5">
                  <HoverCard>
                    <HoverCardTrigger>
                      {truncate(stock.name, 15)}
                    </HoverCardTrigger>
                    <HoverCardContent className="w-full">
                      <p className="w-full max-w-sm font-medium">
                        {stock.name}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Popover>
                      <PopoverTrigger
                        onClick={(e) => {
                          e.stopPropagation();
                        }}>
                        <div
                          className={cn(
                            "rounded-[3.96px] px-4 py-1.5 text-xs font-medium",
                            stock.disponibility === "IN_STOCK"
                              ? "text-[#21D954] bg-[#21D95426]"
                              : stock.disponibility === "OUT_OF_STOCK"
                              ? "text-[#BA0000] bg-[#BA000026]"
                              : "text-[#FFD12E] bg-[#FFD12E26]"
                          )}>
                          {stock.disponibility === "IN_STOCK"
                            ? "Disponible"
                            : stock.disponibility === "OUT_OF_STOCK"
                            ? "Non Dispo"
                            : "Faible"}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-fit">
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <div className="px-4 pt-3 flex items-center justify-center">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startTransition(() => {
                                    updateStockDisponibilityOptimistic(
                                      "IN_STOCK",
                                      idx
                                    );
                                    updateStockDisponibility({
                                      disponibility: "IN_STOCK",
                                      stockId: stock.id,
                                    }).catch(() => {
                                      refetch();
                                      toast.error("Erreur .");
                                    });
                                  });
                                }}
                                className="rounded-[3.96px] px-4 py-1.5 text-xs font-medium text-[#21D954] bg-[#21D95426] cursor-pointer w-full text-center">
                                Disponible
                              </div>
                            </div>
                            <div className="px-4 pt-3 flex items-center justify-center">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startTransition(() => {
                                    updateStockDisponibilityOptimistic(
                                      "LIMITED",
                                      idx
                                    );
                                    updateStockDisponibility({
                                      disponibility: "LIMITED",
                                      stockId: stock.id,
                                    }).catch(() => {
                                      refetch();
                                      toast.error("Erreur .");
                                    });
                                  });
                                }}
                                className="rounded-[3.96px] px-4 py-1.5 text-xs font-medium text-[#FFD12E] bg-[#FFD12E26] cursor-pointer w-full text-center">
                                Faible
                              </div>
                            </div>
                            <div className="px-4 py-3 flex items-center justify-center">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startTransition(() => {
                                    updateStockDisponibilityOptimistic(
                                      "OUT_OF_STOCK",
                                      idx
                                    );
                                    updateStockDisponibility({
                                      disponibility: "OUT_OF_STOCK",
                                      stockId: stock.id,
                                    }).catch(() => {
                                      refetch();
                                      toast.error("Erreur .");
                                    });
                                  });
                                }}
                                className="rounded-[3.96px] px-4 py-1.5 text-xs font-medium text-[#BA0000] bg-[#BA000026] cursor-pointer w-full text-center">
                                Non Dispo
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
                <TableCell className="text-[#95A1B1] text-center">
                  {editingStockId === stock.id ? (
                    <Input
                      className="w-full max-w-28"
                      disabled={isPending}
                      autoFocus
                      type={"number"}
                      value={`${quantity}`}
                      onChange={(e) => setQuantity(e.target.valueAsNumber)}
                      onBlur={() => {
                        setEditingStockId(null);
                        setQuantity(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          startTransition(() => {
                            updateStockQuantityOptimistic(quantity || 0, idx);
                            setEditingStockId(null);
                            setQuantity(null);
                            updateStockQty({
                              stockId: stock.id,
                              quantity: quantity || 0,
                            }).catch(() => {
                              refetch();
                              toast.error("Erreur .");
                            });
                          });
                        }
                      }}
                    />
                  ) : (
                    <p
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingStockId(stock.id);
                        setQuantity(stock.quantity);
                      }}>
                      {" "}
                      {stock.quantity}{" "}
                    </p>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-center">
                    <div
                      style={{
                        backgroundColor: `${stock.type?.color}33`,
                        color: `${stock.type?.color}`,
                      }}
                      className="px-3 py-1.5 rounded-full font-medium text-xs">
                      {stock.type?.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-[#06191D] font-medium p-5 text-center">
                  {stock.wareHouse.name}
                </TableCell>
                <TableCell className="text-[#95A1B1] text-center">
                  {stock.ref}
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
            !!currentStocks?.pages.length && currentStocks?.pages.length <= 1
              ? "text-black"
              : "text-white"
          )}
          variant={
            !!currentStocks?.pages.length && currentStocks?.pages.length <= 1
              ? "ghost"
              : "brand"
          }
          disabled={
            !!currentStocks?.pages.length && currentStocks?.pages.length <= 1
          }
          onClick={() => {
            setIsFetchingPreviousPage(true);
            fetchPreviousPage();
            currentStocks?.pages.length &&
              currentStocks?.pages.length > 1 &&
              currentStocks?.pages.pop();
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

StocksTable.Skeleton = function StocksTable() {
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
    </TableRow>
  );
};
