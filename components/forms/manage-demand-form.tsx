"use client";

import { useState, useTransition } from "react";
import { Check, ArrowRight, Upload, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import z from "zod";
import { ProductFormData, productFormSchema } from "@/schemas/product-schema";
import Image from "next/image";
import { UploadEverything } from "../upload-everything/upload-everything";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import {
  ProductSubtype,
  ProductCategory,
  ProductAudience,
  Product,
  Tissu,
  WorkShop,
  Order,
  DemandMaterial,
  DemandPriority,
  DemandStage,
} from "@prisma/client";
import {
  ProductionInTable,
  ProductVariantWithPricing,
  UserWithWorkshop,
} from "@/types/types";
import { addProduct } from "@/actions/mutations/products/add-product";
import { toast } from "sonner";
import Tiptap from "../tiptap";
import AddProductVariantForm from "./add-product-variant-form";
import { updateProduct } from "@/actions/mutations/products/update-product";
import ManageProductTissues from "./manage-product-tissues";
import { DemandFormData, demandFormSchema } from "@/schemas/demand-schema";
import { updateProduction } from "@/actions/mutations/order/update-production";
import { addProduction } from "@/actions/mutations/order/add-production";
import { addTissu } from "@/actions/mutations/products/add-tissu";
import { addDemandMaterial } from "@/actions/mutations/demand/add-demand-material";
import { addDemand } from "@/actions/mutations/demand/add-demand";

interface Props {
  onCancel: () => void;
  workShops: WorkShop[];
  materials: DemandMaterial[];
}

export default function ManageDemandForm({
  onCancel,
  workShops,
  materials,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [materialInput, setMaterialInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const form = useForm<DemandFormData>({
    resolver: zodResolver(demandFormSchema),
  });

  const onSubmit = (data: DemandFormData) => {
    startTransition(() => {
      addDemand(data)
        .then(() => {
          toast.success("Success !");
          onCancel();
        })
        .catch(() => toast.error("Erreur"));
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8">
          <div className="text-brand text-sm font-medium mb-2">
            Ajouter Demand
          </div>
          <h1 className="text-3xl font-medium text-[#000000]">
            Les Informations de <span className="text-brand">La demand</span>
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="demand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demand</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ecrire votre demand"
                      className="resize-none h-40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Type and Category Row */}
            <FormField
              control={form.control}
              name="workShopId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>L’atelier</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={"L’atelier de production"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workShops.map((workshop) => (
                        <SelectItem key={workshop.id} value={workshop.id}>
                          {workshop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel>Demand</FormLabel>
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
                              {!!field.value
                                ? `${field.value.name}`
                                : "Type de la demand"}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-fit">
                        <div className="space-y-2">
                          <div className="space-y-1">
                            {materials.map((material) => (
                              <div
                                key={material.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange({
                                    id: material.id,
                                    color: material.color,
                                    name: material.name,
                                  });
                                }}
                                className="px-4 pt-3 flex items-center justify-center cursor-pointer">
                                <div
                                  style={{
                                    backgroundColor: `${material?.color}33`,
                                    color: `${material?.color}`,
                                  }}
                                  className="px-3 py-1.5 rounded-[3.96px] font-medium text-xs cursor-pointer w-full max-w-32 flex items-center justify-center">
                                  {material?.name}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="px-4 pb-2">
                            {showAdd ? (
                              <Input
                                className="mb-2"
                                disabled={isPending}
                                type="text"
                                placeholder="ex: en cours.."
                                value={materialInput}
                                onChange={(e) =>
                                  setMaterialInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault(); // Prevent form submission on Enter for this input
                                    startTransition(() => {
                                      addDemandMaterial(materialInput)
                                        .then(() => {
                                          toast.success("Success !");
                                          setMaterialInput("");
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
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorité</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={"Priorité de la demand"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={DemandPriority.URGENT}>
                        urgent
                      </SelectItem>
                      <SelectItem value={DemandPriority.NORMAL}>
                        normal
                      </SelectItem>
                      <SelectItem value={DemandPriority.WEAK}>
                        faible
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="text-[#000000] hover:text-[#000000] hover:bg-[#f3f4f6]">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} variant={"brand"}>
                Add Demand
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
