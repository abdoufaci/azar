"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { generateRandomPassword } from "@/lib/generate-password";
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  RefreshCcw,
  Search,
  XIcon,
} from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";
import { checkUsernameAvailability } from "@/actions/mutations/users/check-username-availability";
import { wilayas } from "@/lib/wilayas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { addClient } from "@/actions/mutations/users/add-client";
import { ProductionInTable, UserWithWorkshop } from "@/types/types";
import { updateClient } from "@/actions/mutations/users/update-client";
import { addOrderToProduction } from "@/actions/mutations/order/add-order-to-production";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { linkOrderWithProduction } from "@/actions/mutations/order/link-order-with-production";
import { useAvailableProductionsQuery } from "@/hooks/use-available-productions-query";
import { useWorkShopsQuery } from "@/hooks/use-workshops-query";

export const AcceptOrderformSchema = z.object({
  workShopId: z.string(),
  price: z.number(),
});

export function AcceptOrderForm() {
  const { onClose, data } = useModal();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProduction, setSelectedProduction] =
    useState<ProductionInTable>();
  const [searchTerm, setSearchTerm] = useState("");

  const { order, onUpdateOrderStatus } = data;
  const { data: productions, isPending: isFetchingProductions } =
    useAvailableProductionsQuery();
  const { data: workShops, isPending: isFetchingWorkShops } =
    useWorkShopsQuery();

  const form = useForm<z.infer<typeof AcceptOrderformSchema>>({
    resolver: zodResolver(AcceptOrderformSchema),
  });
  const [isPending, startTransition] = useTransition();

  async function onSubmit(data: z.infer<typeof AcceptOrderformSchema>) {
    startTransition(() => {
      addOrderToProduction({
        order: order!,
        ...data,
      })
        .then(() => {
          onUpdateOrderStatus?.();
          toast.success("Success !");
          onClose();
        })
        .catch(() => toast.error("Erreur ."));
    });
  }

  const onLink = async () => {
    startTransition(() => {
      linkOrderWithProduction({
        clientId: order?.clientId,
        guestId: order?.guestId,
        orderId: selectedProduction?.id,
        clientOderId: order?.id,
        note: order?.note,
      })
        .then(() => {
          onUpdateOrderStatus?.();
          toast.success("Success !");
          onClose();
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  if (step === 3) {
    return (
      <div className="space-y-5">
        <div className="space-y-2">
          <h1 className="text-[#232626] font-medium">
            Quel est produit de cette commande{" "}
          </h1>
          <Popover>
            <PopoverTrigger asChild>
              <div className="h-fit relative w-full max-w-full min-w-fit border border-[#CFCFCF] cursor-pointer rounded-lg bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none flex justify-between items-center">
                <div className="flex flex-col items-end space-y-1">
                  <span
                    className={cn(
                      !!selectedProduction ? "" : "text-[#A2ABBD]"
                    )}>
                    {!!selectedProduction
                      ? `${selectedProduction?.variant?.name}`
                      : "Choisissez produit"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="p-5 sm:!w-[400px] space-y-2"
              align="start">
              <div className="relative w-full flex-1 max-w-md border border-[#E7F1F8] bg-transparent">
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
              <ScrollArea className="h-40">
                <div className="space-y-5 pt-2">
                  {isFetchingProductions ? (
                    <div className="p-5 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-brand animate-spin" />
                    </div>
                  ) : (
                    productions
                      ?.filter((order) =>
                        order.variant.name
                          .toLowerCase()
                          .trim()
                          .includes(searchTerm.toLowerCase().trim())
                      )
                      .map((production) => {
                        return (
                          <div
                            onClick={() =>
                              selectedProduction?.id === production.id
                                ? setSelectedProduction(undefined)
                                : //@ts-ignore
                                  setSelectedProduction(production)
                            }
                            key={production.id}
                            className={cn(
                              "p-5 rounded-[11.62px] shadow-lg space-y-4 cursor-pointer relative",
                              production.variantId === order?.variantId &&
                                production.subtypeId === production.subtypeId
                                ? "border border-brand"
                                : "border border-[#95A1B11A]",
                              selectedProduction?.id === production.id &&
                                "border border-yellow-brand"
                            )}>
                            {production.variantId === order?.variantId &&
                              production.subtypeId === production.subtypeId && (
                                <h5 className="text-xs font-semibold text-brand absolute top-0 transform -translate-y-1/2 left-5 bg-white">
                                  matched
                                </h5>
                              )}
                            <div className="flex items-center justify-between gap-5">
                              <h1 className="text-[#95A1B1] text-sm">
                                {production.orderId}
                              </h1>
                              <h1 className="text-[#576070] text-sm">
                                <span className="text-[#95A1B1]">
                                  Tissus :{" "}
                                </span>
                                {production.tissu?.name}
                              </h1>
                            </div>
                            <div className="flex items-center gap-5">
                              <div
                                style={{
                                  backgroundColor: `${production.variant.color}33`,
                                  color: `${production.variant.color}`,
                                }}
                                className="rounded-full px-4 py-1.5 text-xs font-medium">
                                {production.variant.name}
                              </div>
                              <h1 className="text-[#182233] font-medium">
                                {production.subType.name}
                              </h1>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
        <Button
          onClick={onLink}
          disabled={isPending}
          type="button"
          variant={"brand"}
          size={"lg"}
          className="w-full">
          Confirmer
        </Button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col items-center justify-center">
          <div className="space-y-6 w-full">
            <FormField
              control={form.control}
              name="workShopId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    à quel atelier cette commande serait-elle destinée
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={"L’atelier de production"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isFetchingWorkShops ? (
                        <div className="p-5 flex items-center justify-center">
                          <Loader2 className="h-5 w-5 text-brand animate-spin" />
                        </div>
                      ) : (
                        workShops?.map((workshop) => (
                          <SelectItem key={workshop.id} value={workshop.id}>
                            {workshop.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix de cette commande</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="prix dzd"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                        value={field?.value?.toString() || ""}
                        className=""
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isPending}
            type="submit"
            variant={"brand"}
            size={"lg"}
            className="w-full">
            Confirmer
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1 className="text-xl font-medium text-[#232626]">
        Produit de cette commande était-elle
      </h1>
      <div className="flex items-center justify-center w-full gap-5">
        <Button
          onClick={() => setStep(3)}
          type="button"
          variant={"brandOutline"}
          size={"lg"}>
          Déja produit
        </Button>
        <Button
          onClick={() => setStep(2)}
          type="button"
          variant={"brand"}
          size={"lg"}>
          nouveau production
        </Button>
      </div>
    </div>
  );
}
