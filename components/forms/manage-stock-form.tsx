"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus, ChevronDown, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  WorkShop,
  StockType,
  StockDisponibility,
  WareHouse,
} from "@prisma/client";
import { toast } from "sonner";
import { addDemandMaterial } from "@/actions/mutations/demand/add-demand-material";
import { StockFormData, stockFormSchema } from "@/schemas/stock-schema";
import { addStock } from "@/actions/mutations/stock/add-stock";
import { addStockType } from "@/actions/mutations/stock/add-stock-type";
import { StockInTable } from "@/types/types";
import { ScrollArea } from "../ui/scroll-area";
import { addWareHouse } from "@/actions/mutations/stock/add-ware-house";

interface Props {
  onCancel: () => void;
  warehouses: WareHouse[];
  types: StockType[];
  isFetchingTypes: boolean;
  isFetchingWareHouses: boolean;
  addStockOptimistic: (stock: StockInTable) => void;
}

export default function ManageStockForm({
  onCancel,
  warehouses: intialWarehouses,
  types: intialTypes,
  isFetchingWareHouses,
  addStockOptimistic,
  isFetchingTypes,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [typeInput, setTypeInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [warehouses, setWareHouses] = useState<WareHouse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingWareHousePending, startAddingWareHouse] = useTransition();
  const [newWareHouseInput, setNewWareHouseInput] = useState("");
  const [types, setTypes] = useState<StockType[]>(intialTypes);

  const form = useForm<StockFormData>({
    resolver: zodResolver(stockFormSchema),
  });

  const onSubmit = (data: StockFormData) => {
    startTransition(() => {
      addStock(data)
        .then((res) => {
          addStockOptimistic(res);
          toast.success("Success !");
          onCancel();
        })
        .catch(() => toast.error("Erreur"));
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  useEffect(() => {
    setWareHouses(intialWarehouses);
  }, [intialWarehouses]);

  const handleAddWareHouse = () => {
    startAddingWareHouse(() => {
      addWareHouse(newWareHouseInput)
        .then((res) => {
          setWareHouses((prev) => [res, ...prev]);
          setNewWareHouseInput("");
          setShowAdd(false);
          toast.success("created !");
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  return (
    <div className=" bg-[#ffffff] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8">
          <div className="text-brand text-sm font-medium mb-2">Stock</div>
          <h1 className="text-3xl font-medium text-[#000000]">
            Les Informations
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="warehouse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dépot</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="h-fit relative w-full max-w-full min-w-fit border border-[#CFCFCF] cursor-pointer rounded-lg bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none flex justify-between items-center">
                        <div className="flex flex-col items-end space-y-1">
                          <span
                            className={cn(
                              !!field.value ? "" : "text-[#A2ABBD]"
                            )}>
                            {!!field.value
                              ? `${field.value?.name}`
                              : "Dépot de Produit"}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 sm:!w-[280px] w-full"
                      align="start">
                      <div className="space-y-2">
                        <div className="px-4 pt-4">
                          <div className="relative w-full flex-1 max-w-md border border-[#E7F1F8] bg-transparent rounded-lg">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A5A5A]" />
                            <Input
                              value={searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.currentTarget.value);
                              }}
                              placeholder="Recherche"
                              className="pl-10 border-none text-[#5A5A5A] placeholder:text-[#5A5A5A] w-full"
                            />
                          </div>
                        </div>
                        {isFetchingWareHouses ? (
                          <div className="px-4 pt-4 flex items-center justify-center">
                            <Loader2 className="h-5 w-5 text-brand animate-spin" />
                          </div>
                        ) : (
                          <ScrollArea className="h-40">
                            <div className="space-y-1">
                              {warehouses
                                ?.filter((warehouse) =>
                                  searchTerm === ""
                                    ? true
                                    : warehouse.name
                                        .toLowerCase()
                                        .trim()
                                        .includes(
                                          searchTerm.toLowerCase().trim()
                                        )
                                )
                                ?.map((warehouse) => {
                                  return (
                                    <div
                                      key={warehouse.id}
                                      onClick={() => {
                                        field.onChange({
                                          id: warehouse.id,
                                          name: warehouse.name,
                                        });
                                      }}
                                      className="flex items-center gap-2 border-b p-4 cursor-pointer">
                                      <h1 className="text-[#232323]">
                                        {warehouse.name}
                                      </h1>
                                    </div>
                                  );
                                })}
                            </div>
                          </ScrollArea>
                        )}
                        <div className="px-4 pb-2">
                          {showAdd ? (
                            <Input
                              className="mb-2"
                              disabled={isAddingWareHousePending}
                              type="text"
                              placeholder="ex: Ouled belhadj"
                              value={newWareHouseInput}
                              onChange={(e) =>
                                setNewWareHouseInput(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleAddWareHouse();
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
                              Ajouter Dépot
                            </Button>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produit</FormLabel>
                  <FormControl>
                    <Input placeholder="nom de produit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:!grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="disponibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disponiblity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={"Disponiblity"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={StockDisponibility.IN_STOCK}>
                          Disponible
                        </SelectItem>
                        <SelectItem value={StockDisponibility.LIMITED}>
                          Faible
                        </SelectItem>
                        <SelectItem value={StockDisponibility.OUT_OF_STOCK}>
                          Non Disponible
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger
                          onClick={(e) => {
                            e.stopPropagation();
                          }}>
                          <div className="h-fit relative w-full max-w-full min-w-fit border border-[#CFCFCF] cursor-pointer rounded-lg bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none flex justify-between items-center">
                            <div className="flex flex-col items-end space-y-1">
                              <span
                                className={cn(
                                  !!field.value ? "" : "text-[#A2ABBD]"
                                )}>
                                {!!field.value ? `${field.value.name}` : "Type"}
                              </span>
                            </div>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-fit">
                          <div className="space-y-2">
                            <div className="space-y-1">
                              {isFetchingTypes ? (
                                <div className="p-4 flex items-center justify-center">
                                  <Loader2 className="h-5 w-5 text-brand animate-spin" />
                                </div>
                              ) : (
                                types.map((type) => (
                                  <div
                                    key={type.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      field.onChange({
                                        id: type.id,
                                        color: type.color,
                                        name: type.name,
                                      });
                                    }}
                                    className="px-4 pt-3 flex items-center justify-center cursor-pointer">
                                    <div
                                      style={{
                                        backgroundColor: `${type?.color}33`,
                                        color: `${type?.color}`,
                                      }}
                                      className="px-3 py-1.5 rounded-[3.96px] font-medium text-xs cursor-pointer w-full max-w-32 flex items-center justify-center">
                                      {type?.name}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                            <div className="px-4 pb-2">
                              {showAdd ? (
                                <Input
                                  className="mb-2"
                                  disabled={isPending}
                                  type="text"
                                  placeholder="ex: en cours.."
                                  value={typeInput}
                                  onChange={(e) => setTypeInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault(); // Prevent form submission on Enter for this input
                                      startTransition(() => {
                                        addStockType(typeInput)
                                          .then((res) => {
                                            setTypes((prev) => [res, ...prev]);
                                            toast.success("Success !");
                                            setTypeInput("");
                                            setShowAdd(false);
                                          })
                                          .catch(() => toast.error("Erreur ."));
                                      });
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
                                  Ajouter Type
                                </Button>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantité</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Quantité"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                        value={field?.value?.toString() || ""}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="text-[#000000] hover:text-[#000000] hover:bg-[#f3f4f6]">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} variant={"brand"}>
                créer un produit de stock
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
