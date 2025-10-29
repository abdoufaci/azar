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

interface Props {
  currentPage: number;
  totalStocks: number;
  stocksPerPage: number;
  searchParams: Record<string, string | string[] | undefined>;
  stocks: StockInTable[];
  url?: string;
}

export function StocksTable({
  currentPage,
  stocksPerPage,
  searchParams,
  totalStocks,
  stocks,
  url = "/management/stock",
}: Props) {
  const [newStockTypeInput, setNewStockTypeInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [isAddingStockTypePending, startAddingStockType] = useTransition();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [inputToEdit, setInputToEdit] = useState<"intial" | "current" | null>(
    null
  );
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState<number | null>(null);
  const [intialQuantity, setIntialQuantity] = useState<number | null>(null);

  const totalPages = Math.ceil(totalStocks / stocksPerPage);

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
              N° Intial
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              N° Reste
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
          {stocks.map((stock) => (
            <TableRow
              key={stock.id}
              className="border-border hover:bg-muted/30 cursor-pointer">
              <TableCell className="text-[#576070] p-5">
                <HoverCard>
                  <HoverCardTrigger>
                    {truncate(stock.name, 15)}
                  </HoverCardTrigger>
                  <HoverCardContent className="w-full">
                    <p className="w-full max-w-sm font-medium">{stock.name}</p>
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
                                  toast.loading("mise a jour...", {
                                    id: "loading",
                                  });
                                  updateStockDisponibility({
                                    disponibility: "IN_STOCK",
                                    stockId: stock.id,
                                  })
                                    .then(() => {
                                      toast.success("Success !");
                                    })
                                    .catch(() => toast.error("Erreur ."))
                                    .finally(() => toast.dismiss("loading"));
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
                                  toast.loading("mise a jour...", {
                                    id: "loading",
                                  });
                                  updateStockDisponibility({
                                    disponibility: "LIMITED",
                                    stockId: stock.id,
                                  })
                                    .then(() => {
                                      toast.success("Success !");
                                    })
                                    .catch(() => toast.error("Erreur ."))
                                    .finally(() => toast.dismiss("loading"));
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
                                  toast.loading("mise a jour...", {
                                    id: "loading",
                                  });
                                  updateStockDisponibility({
                                    disponibility: "OUT_OF_STOCK",
                                    stockId: stock.id,
                                  })
                                    .then(() => {
                                      toast.success("Success !");
                                    })
                                    .catch(() => toast.error("Erreur ."))
                                    .finally(() => toast.dismiss("loading"));
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
                {editingStockId === stock.id && inputToEdit === "intial" ? (
                  <Input
                    className="w-full max-w-28"
                    disabled={isPending}
                    autoFocus
                    type={"number"}
                    value={`${intialQuantity}`}
                    onChange={(e) => setIntialQuantity(e.target.valueAsNumber)}
                    onBlur={() => {
                      setEditingStockId(null);
                      setIntialQuantity(null);
                      setInputToEdit(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        startTransition(() => {
                          updateStockQty({
                            stockId: stock.id,
                            intialQuantity: intialQuantity || 0,
                            currentQuantity: stock.currentQuantity,
                          })
                            .then(() => {
                              toast.success("Success !");
                              setEditingStockId(null);
                              setIntialQuantity(null);
                              setInputToEdit(null);
                            })
                            .catch(() => toast.error("Erreur ."));
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
                      setIntialQuantity(stock.intialQuantity);
                      setInputToEdit("intial");
                    }}>
                    {" "}
                    {stock.intialQuantity}{" "}
                  </p>
                )}
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {editingStockId === stock.id && inputToEdit === "current" ? (
                  <Input
                    className="w-full max-w-28"
                    disabled={isPending}
                    autoFocus
                    type={"number"}
                    value={`${currentQuantity}`}
                    onChange={(e) => setCurrentQuantity(e.target.valueAsNumber)}
                    onBlur={() => {
                      setEditingStockId(null);
                      setCurrentQuantity(null);
                      setInputToEdit(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        startTransition(() => {
                          updateStockQty({
                            stockId: stock.id,
                            intialQuantity: stock.intialQuantity,
                            currentQuantity: currentQuantity || 0,
                          })
                            .then(() => {
                              toast.success("Success !");
                              setEditingStockId(null);
                              setCurrentQuantity(null);
                              setInputToEdit(null);
                            })
                            .catch(() => toast.error("Erreur ."));
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
                      setCurrentQuantity(stock.currentQuantity);
                      setInputToEdit("current");
                    }}>
                    {stock.currentQuantity}
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
                <div className="flex items-start justify-center gap-1.5">
                  <Image
                    alt="workshop"
                    src={stock.workshop?.image || "/workshop2.svg"}
                    width={25}
                    height={25}
                    className="rounded-lg object-cover"
                  />
                  <h1>{stock.workshop.name}</h1>
                </div>
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {stock.ref}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col md:!flex-row md:!items-center justify-between gap-4 p-5">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * stocksPerPage + 1} to{" "}
          {Math.min(currentPage * stocksPerPage, totalStocks)} of {totalStocks}{" "}
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
