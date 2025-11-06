"use client";

import {
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  Check,
  ArrowRight,
  Upload,
  Plus,
  ChevronDown,
  Search,
  Pen,
  Loader2,
} from "lucide-react";
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
import {
  ProductionFormData,
  productionFormSchema,
} from "@/schemas/production-schema";
import { updateProduction } from "@/actions/mutations/order/update-production";
import { addProduction } from "@/actions/mutations/order/add-production";
import { addTissu } from "@/actions/mutations/products/add-tissu";
import { useProductionsQuery } from "@/hooks/admin/use-query-productions";
import { ScrollArea } from "../ui/scroll-area";
import { useTissuesQuery } from "@/hooks/use-tissues-query";
import { useEmployeesClientsQuery } from "@/hooks/use-employees-clients-query";
import { useVariantsQuery } from "@/hooks/use-variants-query";

interface Props {
  onCancel: () => void;
  types: ProductSubtype[];
  variants: ProductVariantWithPricing[];
  production: ProductionInTable | null;
  motherOrder: ProductionInTable | null;
  tissues: Tissu[];
  clients: UserWithWorkshop[];
  workShops: WorkShop[];
  addProductionOptimistic: (action: ProductionInTable) => void;
  updateProductionOptimistic: (action: ProductionInTable) => void;
  isFetchingVariants: boolean;
}

export default function ManageProductionForm({
  onCancel,
  types,
  production,
  workShops,
  motherOrder,
  addProductionOptimistic,
  updateProductionOptimistic,
  isFetchingVariants,
  variants: intialVariants,
}: Props) {
  const { data: users } = useEmployeesClientsQuery();
  const clients = users?.clients ?? [];
  const {
    data: intialTissues,
    isPending: isFetchingTissues,
    refetch,
  } = useTissuesQuery();
  const [tissues, addTissuOptimistic] = useOptimistic(
    intialTissues || [],
    (state, incoming: Tissu) => [incoming, ...state]
  );
  const [variants, manageVariantOptimistic] = useOptimistic(
    intialVariants,
    (
      state,
      action:
        | { type: "add"; incoming: ProductVariantWithPricing }
        | { type: "update"; updatedState: ProductVariantWithPricing[] }
    ) => {
      switch (action.type) {
        case "add":
          return [action.incoming, ...state];
        case "update":
          return action.updatedState;
        default:
          return state;
      }
    }
  );

  const [step, setStep] = useState<1 | 2 | 3>(production ? 2 : 1);
  const [typesToRemove, setTypesToRemove] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const [newTissuInput, setNewTissuInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [isAddingTissuePending, startAddingTissue] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [variantSearchTerm, setVariantSearchTerm] = useState("");
  const [variantToEdit, setVariantToEdit] =
    useState<ProductVariantWithPricing | null>(null);

  const foundVariant = variants.find(
    (variant) => variant.id === production?.variantId
  );

  const form = useForm<ProductionFormData>({
    resolver: zodResolver(productionFormSchema),
    defaultValues: {
      category: production ? production.variant.category : undefined,
      clientId: production?.clientId || undefined,
      note: production?.note,
      price: production?.price || 0,
      subtypeId: production?.subtypeId,
      tissu: production?.tissu
        ? { name: production?.tissu?.name, id: production?.tissu?.id }
        : undefined,
      variant: foundVariant
        ? {
            color: foundVariant?.color,
            id: foundVariant?.id,
            name: foundVariant?.name,
          }
        : undefined,
      workShopId: production?.workShopId || "",
    },
  });

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

  const handleAddTissue = () => {
    startAddingTissue(() => {
      addTissu({ name: newTissuInput })
        .then((res) => {
          addTissuOptimistic(res);
          refetch();
          setNewTissuInput("");
          setShowAdd(false);
          toast.success("created !");
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  const onSubmit = (data: ProductionFormData) => {
    startTransition(() => {
      production
        ? updateProduction({
            data,
            productionId: production.id,
            oldData: {
              category: production.variant.category,
              clientId: production?.clientId || "",
              note: production?.note || "",
              price: production?.price || 0,
              subtypeId: production?.subtypeId || "",
              tissu: production?.tissu
                ? { name: production?.tissu?.name, id: production?.tissu?.id }
                : undefined,
              variant: {
                color: foundVariant?.color || "",
                id: foundVariant?.id || "",
                name: foundVariant?.name || "",
              },
              workShopId: production?.workShopId || "",
            },
          })
            .then((res) => {
              //@ts-ignore
              updateProductionOptimistic(res);
              toast.success("updated !");
              onCancel();
            })
            .catch(() => toast.error("Erreur ."))
        : addProduction({
            data,
            selectedVariant: variants.find(
              (vari) => vari.id === data.variant.id
            ),
            subOrderId: motherOrder?.id,
          })
            .then((data) => {
              //@ts-ignore
              addProductionOptimistic(data);
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
        variant={variantToEdit}
        onAddVariant={(variant) =>
          manageVariantOptimistic({ type: "add", incoming: variant })
        }
        onUpdateVariant={(variant) => {
          let curr = variants;
          const idx = curr.findIndex((item) => item.id === variant.id);
          curr[idx] = {
            ...variant,
          };

          manageVariantOptimistic({ type: "update", updatedState: curr });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8">
          <div className="text-brand text-sm font-medium mb-2">
            Production{" "}
            {!!motherOrder && (
              <span className="text-xs text-black">
                Sous command de{" "}
                <span className="text-brand">{motherOrder.orderId}</span>
              </span>
            )}
          </div>
          <h1 className="text-3xl font-medium text-[#000000]">
            Les Informations de{" "}
            <span className="text-brand">{categoryLabel}</span>
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <div className="px-4 pt-4">
                            <div className="relative w-full flex-1 max-w-md border border-[#E7F1F8] bg-transparent rounded-lg">
                              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A5A5A]" />
                              <Input
                                value={variantSearchTerm}
                                onChange={(e) => {
                                  setVariantSearchTerm(e.currentTarget.value);
                                }}
                                placeholder="Recherche"
                                className="pl-10 border-none text-[#5A5A5A] placeholder:text-[#5A5A5A] w-full"
                              />
                            </div>
                          </div>
                          <ScrollArea className="h-40">
                            <div className="space-y-1">
                              {isFetchingVariants ? (
                                <Loader2 className="h-5 w-5 text-brand animate-spin" />
                              ) : (
                                variants
                                  .filter(
                                    (variant) =>
                                      variant.category === selectedCategory &&
                                      variant.name
                                        .toLowerCase()
                                        .trim()
                                        .includes(
                                          variantSearchTerm.toLowerCase().trim()
                                        )
                                  )
                                  .map((variant) => (
                                    <div
                                      key={variant.id}
                                      onClick={() =>
                                        field.onChange({
                                          name: variant.name,
                                          id: variant.id,
                                          color: variant.color,
                                        })
                                      }
                                      className="border-b px-4 py-2 cursor-pointer flex items-center gap-5">
                                      <div
                                        style={{
                                          backgroundColor: `${variant.color}33`,
                                        }}
                                        className=" rounded-full px-5 py-1 w-fit">
                                        <h1
                                          style={{
                                            color: variant.color,
                                          }}
                                          className="font-medium">
                                          {variant.name}
                                        </h1>
                                      </div>
                                      <svg
                                        onClick={() => {
                                          setStep(3);
                                          setVariantToEdit(variant);
                                        }}
                                        width="17"
                                        height="18"
                                        viewBox="0 0 17 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                          d="M0.6875 17.1878H15.3542M2.21467 10.0259C1.82381 10.4176 1.60426 10.9484 1.60417 11.5017V14.4378H4.55858C5.11225 14.4378 5.643 14.2178 6.03442 13.8255L14.7428 5.11256C15.1335 4.72077 15.3529 4.19004 15.3529 3.63672C15.3529 3.08341 15.1335 2.55268 14.7428 2.16089L13.8829 1.29922C13.689 1.10521 13.4588 0.951327 13.2053 0.846362C12.9519 0.741398 12.6803 0.687415 12.406 0.6875C12.1317 0.687585 11.8601 0.741737 11.6067 0.846858C11.3534 0.95198 11.1232 1.10601 10.9294 1.30014L2.21467 10.0259Z"
                                          stroke="#A2ABBD"
                                          stroke-width="1.375"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  ))
                              )}
                            </div>
                          </ScrollArea>
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
                name="subtypeId"
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
                            <SelectItem key={price.id} value={price.subtypeId}>
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
            {selectedCategory === "SALON" && (
              <FormField
                control={form.control}
                name="tissu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tissus*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="h-fit relative w-full max-w-full min-w-fit border border-[#CFCFCF] cursor-pointer rounded-lg bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none flex justify-between items-center">
                          <div className="flex flex-col items-end space-y-1">
                            <span
                              className={cn(
                                !!field.value ? "" : "text-[#A2ABBD]"
                              )}>
                              {!!field.value
                                ? `${field.value.name}`
                                : "choissez les tissues disponible"}
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
                          {isFetchingTissues ? (
                            <div className="px-4 pt-4 flex items-center justify-center">
                              <Loader2 className="h-5 w-5 text-brand animate-spin" />
                            </div>
                          ) : (
                            <ScrollArea className="h-40">
                              <div className="space-y-1">
                                {tissues
                                  ?.filter((tissu) =>
                                    tissu.name
                                      .toLowerCase()
                                      .trim()
                                      .includes(searchTerm.toLowerCase().trim())
                                  )
                                  ?.map((tissu) => {
                                    return (
                                      <div
                                        key={tissu.id}
                                        onClick={() => {
                                          field.onChange({
                                            id: tissu.id,
                                            name: tissu.name,
                                          });
                                        }}
                                        className="flex items-center gap-2 border-b p-4 cursor-pointer">
                                        <h1 className="text-[#232323]">
                                          {tissu.name}
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
                                disabled={isAddingTissuePending}
                                type="text"
                                placeholder="ex: Tissius56416"
                                value={newTissuInput}
                                onChange={(e) =>
                                  setNewTissuInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleAddTissue();
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
                                Ajouter Tissue
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

            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={"Client de tabme"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
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
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="observation de le produit"
                      className="resize-none h-40"
                      {...field}
                    />
                  </FormControl>
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
                {production ? "update" : "Add"} Production
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
