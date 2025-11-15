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
  SupplierProduct,
} from "@prisma/client";
import { toast } from "sonner";
import { addDemandMaterial } from "@/actions/mutations/demand/add-demand-material";
import { addStock } from "@/actions/mutations/stock/add-stock";
import { addStockType } from "@/actions/mutations/stock/add-stock-type";
import { StockInTable, SupplierProductInTable } from "@/types/types";
import { ScrollArea } from "../ui/scroll-area";
import { addWareHouse } from "@/actions/mutations/stock/add-ware-house";
import {
  SupplierProductFormData,
  supplierProductFormSchema,
} from "@/schemas/supplier-product-schema";
import { addSupplierProduct } from "@/actions/mutations/supply/add-supplier-product";
import { useStockTypesQuery } from "@/hooks/use-stock-types-query";
import { updateSupplierProduct } from "@/actions/mutations/supply/update-supplier-product";

interface Props {
  onClose: () => void;
  addProductOptimitic: (item: SupplierProductInTable) => void;
  updateProductOptimitic: (item: SupplierProductInTable) => void;
  product: SupplierProductInTable | null;
}

export default function ManageSupplierProductForm({
  onClose,
  addProductOptimitic,
  updateProductOptimitic,
  product,
}: Props) {
  const { data: intialTypes, isPending: isFetchingTypes } =
    useStockTypesQuery();
  const [isPending, startTransition] = useTransition();
  const [typeInput, setTypeInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [warehouses, setWareHouses] = useState<WareHouse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingWareHousePending, startAddingWareHouse] = useTransition();
  const [newWareHouseInput, setNewWareHouseInput] = useState("");
  const [types, setTypes] = useState<StockType[]>(intialTypes ?? []);

  const form = useForm<SupplierProductFormData>({
    resolver: zodResolver(supplierProductFormSchema),
    defaultValues: {
      name: product?.name,
      quantity: product?.quantity,
      type: !!product
        ? {
            id: product.type.id,
            color: product.type.color,
            name: product.type.name,
          }
        : undefined,
      unitPrice: product?.unitPrice,
    },
  });

  const onSubmit = (data: SupplierProductFormData) => {
    startTransition(() => {
      product
        ? updateSupplierProduct({ data, id: product.id })
            .then((res) => {
              updateProductOptimitic(res);
              toast.success("Success .");
              onClose();
            })
            .catch(() => toast.error("Erreur ."))
        : addSupplierProduct(data)
            .then((res) => {
              addProductOptimitic(res);
              toast.success("Success .");
              onClose();
            })
            .catch(() => toast.error("Erreur ."));
    });
  };

  useEffect(() => {
    setTypes(intialTypes ?? []);
  }, [intialTypes]);

  const unitPrice = form.watch("unitPrice");
  const quantity = form.watch("quantity");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          className={cn(!!field.value ? "" : "text-[#A2ABBD]")}>
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
                          types?.map((type) => (
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
        <div className="grid grid-cols-1 md:!grid-cols-2 gap-5">
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
          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix Unitaire</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Prix Unitaire"
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
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-[#182233]">Prix Total</h1>
          <h3 className="text-brand font-medium">
            {!!quantity && !!unitPrice ? `${quantity * unitPrice} da` : "-"}
          </h3>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          variant={"brand"}
          className="w-full">
          Confirmé
        </Button>
      </form>
    </Form>
  );
}
