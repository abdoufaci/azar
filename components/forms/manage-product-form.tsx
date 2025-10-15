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
} from "@prisma/client";
import { ProductVariantWithPricing } from "@/types/types";
import { addProduct } from "@/actions/mutations/products/add-product";
import { toast } from "sonner";
import Tiptap from "../tiptap";
import AddProductVariantForm from "./add-product-variant-form";
import { updateProduct } from "@/actions/mutations/products/update-product";
import ManageProductTissues from "./manage-product-tissues";

interface Props {
  onCancel: () => void;
  types: ProductSubtype[];
  variants: ProductVariantWithPricing[];
  audience: ProductAudience;
  product:
    | (Product & {
        tissues: Tissu[];
      })
    | null;
  tissues: Tissu[];
}

export default function ManageProductForm({
  onCancel,
  types,
  variants,
  audience,
  product,
  tissues,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(product ? 2 : 1);
  const [typesToRemove, setTypesToRemove] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [tissuesToRemove, setTissuesToRemove] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const [imagesToDelete, setImagesToDelete] = useState<
    {
      id: string;
      type: string;
    }[]
  >([]);

  const foundVariant = variants.find(
    (variant) => variant.id === product?.variantId
  );

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      //@ts-ignore
      images: (product?.images as any[]) || [],
      tissues:
        product?.tissues.map((tissu) => ({
          id: tissu.id,
          name: tissu.name,
        })) || [],
      language: "fr",
      mainImageIdx: product?.mainImageIdx || 0,
      price: product?.price || 0,
      category: product?.category,
      descriptionAr: product?.arDescription,
      descriptionFr: product?.frDescription,
      nameAr: product?.arName,
      nameFr: product?.frName,
      pricingId: product?.pricingId,
      variant: foundVariant
        ? {
            color: foundVariant?.color,
            id: foundVariant?.id,
            name: foundVariant?.name,
          }
        : undefined,
    },
  });
  const MainImageIdx = form.watch("mainImageIdx");

  const categories = [
    {
      id: ProductCategory.SALON,
      label: "Salons",
      image: "/salon.png",
    },
    {
      id: ProductCategory.TABLE,
      label: "Tables",
      image: "/tables.png",
    },
    {
      id: ProductCategory.CHAIR,
      label: "Chaises",
      image: "/chair.png",
    },
  ];

  const handleContinue = () => {
    const category = form.getValues("category");
    if (category) {
      setStep(2);
    }
  };

  const onSubmit = (data: ProductFormData) => {
    startTransition(() => {
      product
        ? updateProduct({
            data,
            productId: product.id,
            imagesToDelete,
            tissuesToRemove,
          })
            .then(() => {
              toast.success("updated !");
              onCancel();
            })
            .catch(() => toast.error("Erreur ."))
        : addProduct({
            data,
            audience,
          })
            .then(() => {
              toast.success("Created !");
              onCancel();
            })
            .catch(() => toast.error("Erreur ."));
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  const selectedCategory = form.watch("category");
  const currentLanguage = form.watch("language");
  const selectedVariant = form.watch("variant");

  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6 w-full">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="text-2xl font-medium text-center text-[#000000] mb-16 leading-tight">
            Quel type de produits vous
            <br />
            souhaitez ajouter ?
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => form.setValue("category", category.id)}
                  className={`relative rounded-[9px] transition-all duration-300 ${
                    isSelected ? "ring-4 ring-brand" : "opacity-80"
                  }`}>
                  {isSelected && (
                    <div
                      className="absolute top-0 right-0 z-10 w-8 h-8 bg-brand rounded-full flex items-center 
                    justify-center shadow-lg transform translate-x-1/2 -translate-y-1/2">
                      <Check className="w-5 h-5 text-white stroke-[3]" />
                    </div>
                  )}

                  <div className="aspect-[4/4] relative">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.label}
                      height={400}
                      width={400}
                      className={`w-full h-full object-cover rounded-[9px] ${
                        !isSelected ? "grayscale" : ""
                      }`}
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-[9px] p-6">
                      <h2 className="text-white text-2xl font-semibold">
                        {category.label}
                      </h2>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              variant={"brand"}
              className="rounded-full px-14">
              Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const categoryLabel =
    categories.find((c) => c.id === selectedCategory)?.label || "";

  if (step === 3) {
    return (
      <AddProductVariantForm
        categoryLabel={categoryLabel}
        selectedCategory={selectedCategory}
        handleCancel={() => setStep(2)}
        onContinue={() => setStep(2)}
        types={types}
        setTypesToRemove={setTypesToRemove}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8">
          <div className="text-brand text-sm font-medium mb-2">B2B</div>
          <h1 className="text-3xl font-medium text-[#000000]">
            Les Informations de{" "}
            <span className="text-brand">{categoryLabel}</span>
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "",
                        !!field.value.length &&
                          "border-2 border-[#A2ABBD] rounded-[7px] p-4"
                      )}>
                      <UploadEverything
                        isMutliple
                        value={form.watch("images")}
                        onChange={field.onChange}
                        imageContainerClassName="w-24 min-w-24 !h-24 min-h-24"
                        MainImageIdx={MainImageIdx}
                        onClick={(idx) => {
                          form.setValue(
                            "mainImageIdx",
                            MainImageIdx === idx ? 0 : idx
                          );
                        }}
                        setImagesToDelete={setImagesToDelete}>
                        {!!field.value.length ? (
                          <div
                            className="w-24 h-24 rounded-[10px] border-2 border-dashed border-[#d1d5db] bg-[#F3F6F8] 
                          flex items-center justify-center cursor-pointer">
                            <div className="h-6 w-6 border-2 border-[#A2ABBD] rounded-[9.7px] flex items-center justify-center">
                              <Plus className="h-4 w-4 text-[#A2ABBD]" />
                            </div>
                          </div>
                        ) : (
                          <div className="min-w-80 border-2 border-dashed border-[#d1d5db] rounded-lg p-12 text-center hover:border-brand transition-colors cursor-pointer">
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="w-8 h-8 text-brand" />
                              <p className="text-sm text-[#6b7280]">
                                <span className="text-brand font-medium">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                            </div>
                          </div>
                        )}
                      </UploadEverything>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type and Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="variant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedCategory === "CHAIR"
                        ? "Chaise"
                        : selectedCategory === "TABLE"
                        ? "Table"
                        : "Salon"}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="h-fit relative w-full max-w-full min-w-fit border border-[#CFCFCF] cursor-pointer rounded-lg bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none flex justify-between items-center">
                          <div className="flex flex-col items-end space-y-1">
                            <span
                              className={cn(
                                !!field.value ? "" : "text-[#A2ABBD]"
                              )}>
                              {!!field.value
                                ? field.value.name
                                : selectedCategory === "CHAIR"
                                ? "Chaise"
                                : selectedCategory === "TABLE"
                                ? "Table"
                                : "Salon"}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="pb-1 !p-0 sm:!w-[280px] w-full "
                        align="start">
                        <div className="space-y-2">
                          <div className="space-y-1">
                            {variants
                              .filter(
                                (model) => model.category === selectedCategory
                              )
                              .map((model) => (
                                <div
                                  key={model.id}
                                  onClick={() =>
                                    field.onChange({
                                      name: model.name,
                                      id: model.id,
                                      color: model.color,
                                    })
                                  }
                                  className="border-b px-4 py-2 cursor-pointer">
                                  <div
                                    style={{
                                      backgroundColor: `${model.color}33`,
                                    }}
                                    className=" rounded-full px-5 py-1 w-fit">
                                    <h1
                                      style={{
                                        color: model.color,
                                      }}
                                      className="font-medium">
                                      {model.name}
                                    </h1>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <div className="px-4">
                            <Button
                              type="button" // Important: type="button" to prevent submitting the form
                              onClick={() => setStep(3)}
                              variant="brand_link"
                              className="!p-0">
                              <Plus className="h-4 w-4" />
                              Ajouter SALON
                            </Button>
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
                name="pricingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Type de ${
                              selectedCategory === "CHAIR"
                                ? "chaise"
                                : selectedCategory === "TABLE"
                                ? "table"
                                : "salon"
                            }`}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {variants
                          .find((variant) => variant.id === selectedVariant?.id)
                          ?.pricings.map((price) => (
                            <SelectItem key={price.id} value={price.id}>
                              {price.subtype.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {selectedCategory === "SALON" && audience === "B2C" && (
              <FormField
                control={form.control}
                name="tissues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tissue</FormLabel>
                    <FormControl>
                      <ManageProductTissues
                        selectedTissues={field.value}
                        onChange={field.onChange}
                        setTissuesToRemove={setTissuesToRemove}
                        tissues={tissues}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                        value={field.value.toString() || ""}
                        className="pr-16"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-brand">
                        DZD
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language Tabs */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-8 border-b border-[#e5e7eb]">
                    <button
                      type="button"
                      onClick={() => field.onChange("fr")}
                      className={`pb-3 text-sm font-medium transition-colors relative ${
                        currentLanguage === "fr"
                          ? "text-brand"
                          : "text-[#6b7280] hover:text-[#000000]"
                      }`}>
                      Français
                      {currentLanguage === "fr" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("ar")}
                      className={`pb-3 text-sm font-medium transition-colors relative ${
                        currentLanguage === "ar"
                          ? "text-brand"
                          : "text-[#6b7280] hover:text-[#000000]"
                      }`}>
                      عربي
                      {currentLanguage === "ar" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
                      )}
                    </button>
                  </div>
                </FormItem>
              )}
            />

            {/* Name */}
            {currentLanguage === "fr" && (
              <FormField
                control={form.control}
                name="nameFr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nom <span className="text-[#9ca3af]">(Optionnel)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de Salon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentLanguage === "ar" && (
              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-right">
                      <div className="w-full">
                        اسم <span className="text-[#9ca3af]">(اختياري)</span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="اسم الصالون" {...field} dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Description */}
            {currentLanguage === "fr" && (
              <FormField
                control={form.control}
                name="descriptionFr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Tiptap
                        description={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentLanguage === "ar" && (
              <FormField
                control={form.control}
                name="descriptionAr"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-right">
                      <div className="w-full">وصف</div>
                    </FormLabel>
                    <FormControl>
                      <Tiptap
                        description={field.value}
                        onChange={field.onChange}
                        isArabic
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                {product ? "update" : "Add"} Product
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
