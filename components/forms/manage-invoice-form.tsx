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
import { updateInvoiceDetails } from "@/actions/mutations/users/update-invoice-details";
import { manageUserInvoice } from "@/actions/mutations/users/manage-user-invoice";

export const ManageInvoiceformSchema = z.object({
  assurance: z.number(),
  deposit: z.number(),
  payment: z.number(),
  other: z.number(),
});

export function ManageInvoiceForm() {
  const { onClose, data } = useModal();
  const { user, invoice, date } = data;
  const form = useForm<z.infer<typeof ManageInvoiceformSchema>>({
    resolver: zodResolver(ManageInvoiceformSchema),
    defaultValues: {
      assurance: invoice?.assurance,
      deposit: invoice?.deposit,
      payment: invoice?.payment,
      other: invoice?.other,
    },
  });
  const [isPending, startTransition] = useTransition();

  async function onSubmit(data: z.infer<typeof ManageInvoiceformSchema>) {
    startTransition(() => {
      manageUserInvoice({
        ...data,
        userId: user?.id,
        invoiceId: invoice?.id,
        date: date || new Date(),
      })
        .then((res) => {
          toast.success("Success");
          onClose();
        })
        .catch((err) => {
          console.log({ err });
          toast.error("Erreur");
        });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:!grid-cols-2 gap-5 w-full">
          <FormField
            control={form.control}
            name="assurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assurence</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                      value={field.value?.toString() || ""}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acompte</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                      value={field.value?.toString() || ""}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Versement</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                      value={field.value?.toString() || ""}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Autre</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                      value={field.value?.toString() || ""}
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
          Confirm
        </Button>
      </form>
    </Form>
  );
}
