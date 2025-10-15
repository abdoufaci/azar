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
import { UserWithWorkshop } from "@/types/types";
import { updateClient } from "@/actions/mutations/users/update-client";
import { manageCart } from "@/actions/mutations/cart/manage-cart";
import { useCartQuery } from "@/hooks/use-cart-query";

export const ChooseTissuformSchema = z.object({
  tissuId: z.string(),
});

export function ChooseTissuForm() {
  const { data, onClose } = useModal();

  const { product, tissues } = data;

  const form = useForm<z.infer<typeof ChooseTissuformSchema>>({
    resolver: zodResolver(ChooseTissuformSchema),
    defaultValues: {},
  });
  const { refetch } = useCartQuery();
  const [isPending, startTransition] = useTransition();

  async function onSubmit(data: z.infer<typeof ChooseTissuformSchema>) {
    startTransition(() => {
      manageCart({
        product: product!,
        tissuId: data.tissuId,
      })
        .then((res) => {
          if (res.status === "guest_cart_created" && !!res?.cart) {
            localStorage.setItem("cart_Id", res.cart.id);
          }
          refetch();
          onClose();
          toast.success("Produit ajouter !");
        })
        .catch(() => toast.error("Erreur"));
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-center justify-center">
        <div className="space-y-6 w-full">
          <FormField
            control={form.control}
            name="tissuId"
            render={({ field }) => (
              <FormItem className="flex flex-col items-end w-full text-[#15091B]">
                <FormLabel
                  htmlFor="slogan"
                  className="text-[#182233] text-lg font-normal">
                  القماش
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tissues?.map((tissu) => (
                      <SelectItem key={tissu.id} value={tissu.id}>
                        {tissu.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={isPending}
          type="submit"
          variant={"yellow_brand"}
          size={"lg"}
          className="w-full">
          اضافة
        </Button>
      </form>
    </Form>
  );
}
