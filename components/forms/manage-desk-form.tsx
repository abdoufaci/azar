"use client";

import { useState, useTransition } from "react";
import { Plus, ChevronDown } from "lucide-react";
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
  DeskType,
  Desk,
} from "@prisma/client";
import { toast } from "sonner";
import { addDemandMaterial } from "@/actions/mutations/demand/add-demand-material";
import { StockFormData, stockFormSchema } from "@/schemas/stock-schema";
import { addStock } from "@/actions/mutations/stock/add-stock";
import { addStockType } from "@/actions/mutations/stock/add-stock-type";
import { DeskFormData, deskFormSchema } from "@/schemas/desk-schema";
import { addDesk } from "@/actions/mutations/stock/add-desk";
import { updateDesk } from "@/actions/mutations/stock/update-desk";
import { SaveEditDeskModal } from "../modals/save-edit-desk-modal";

interface Props {
  onCancel: () => void;
  desk?: Desk | null;
}

export default function ManageDeskForm({ onCancel, desk }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<DeskFormData>({
    resolver: zodResolver(deskFormSchema),
    defaultValues: {
      amount: desk?.amount,
      name: desk?.name,
      type: desk?.type,
    },
  });

  const onSubmit = (data: DeskFormData) => {
    // updateDesk({ data, deskId: desk.id })
    //         .then(() => {
    //           toast.success("Success !");
    //           onCancel();
    //         })
    //         .catch(() => toast.error("Erreur"))
    desk
      ? setIsOpen(true)
      : startTransition(() => {
          addDesk(data)
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
    <div className=" bg-[#ffffff] flex flex-col items-center justify-center p-6">
      <SaveEditDeskModal
        deskId={desk?.id || ""}
        data={{
          amount: form.watch("amount"),
          name: form.watch("name"),
          type: form.watch("type"),
        }}
        currentData={{
          name: desk?.name || "",
          amount: desk?.amount || 0,
          type: desk?.type || "DEPOSIT",
        }}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onComplete={() => {
          setIsOpen(false);
          onCancel();
        }}
      />
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8">
          <div className="text-brand text-sm font-medium mb-2">Caisse</div>
          <h1 className="text-3xl font-medium text-[#000000]">
            Les Informations
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:!grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={"Type"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={DeskType.DEPOSIT}>Entrée</SelectItem>
                        <SelectItem value={DeskType.WITHDRAWAL}>
                          Sortie
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Montant"
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
            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="text-[#000000] hover:text-[#000000] hover:bg-[#f3f4f6]">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} variant={"brand"}>
                {desk ? "mise a jour" : "créer"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
