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
import { UserWithWorkshop } from "@/types/types";
import { updateClient } from "@/actions/mutations/users/update-client";
import { manageCart } from "@/actions/mutations/cart/manage-cart";
import { useCartQuery } from "@/hooks/use-cart-query";

export const ChooseTissuformSchema = z.object({
  tissuId: z.string(),
});

export function ChooseTissuForm() {
  const { data, onClose } = useModal();
  const [searchTerm, setSearchTerm] = useState("");

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
                    <div className="p-2">
                      <div className="relative w-full flex-1 border border-[#E7F1F8] bg-transparent rounded-lg">
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
                    {tissues
                      ?.filter((tissu) =>
                        tissu.name
                          .toLowerCase()
                          .trim()
                          .includes(searchTerm.toLowerCase().trim())
                      )
                      ?.map((tissu) => (
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
