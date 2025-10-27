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
  Minus,
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { addWorkShop } from "@/actions/mutations/workshop/add-workshop";

export const ManageWorkShopformSchema = z.object({
  name: z.string(),
  employees: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      role: z.string(),
      avatar: z.string(),
    })
  ),
});

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export function ManageWorkShopForm() {
  const { onClose, data } = useModal();

  const { employees: users } = data;

  const [isPending, startTransition] = useTransition();
  const [steps, setSteps] = useState<1 | 2>(1);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<z.infer<typeof ManageWorkShopformSchema>>({
    resolver: zodResolver(ManageWorkShopformSchema),
    defaultValues: {
      employees: [],
    },
  });

  const employees = form.watch("employees");

  const removeMember = (id: string) => {
    const updatedMembers = employees.filter((m) => m.id !== id);
    form.setValue("employees", updatedMembers);
  };

  const toggleMember = (member: Member) => {
    const isSelected = employees.some((m) => m.id === member.id);
    let updatedMembers: Member[];

    if (isSelected) {
      updatedMembers = employees.filter((m) => m.id !== member.id);
    } else {
      updatedMembers = [...employees, member];
    }

    form.setValue("employees", updatedMembers);
  };

  async function onSubmit(data: z.infer<typeof ManageWorkShopformSchema>) {
    startTransition(() => {
      addWorkShop(data)
        .then(() => {
          onClose();
          toast.success("Atelier ajouté avec succès");
        })
        .catch(() => toast.error("Erreur lors de l'ajout de l'atelier"));
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-center justify-center">
        <div className="space-y-6 w-full">
          {steps === 2 && (
            <ScrollArea className="h-96">
              <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start w-full text-[#15091B]">
                    <FormControl>
                      <div className="space-y-6 w-full">
                        <div className="flex flex-wrap items-center gap-4">
                          {field.value.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-3 rounded-full bg-[#ffffff] border border-[#EBECF2] p-1">
                              <Avatar className="h-7 w-7">
                                <AvatarImage
                                  src={member.avatar || "/placeholder.svg"}
                                  alt={member.name}
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-brand text-white">
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-[#182233]">
                                {member.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-full bg-[#ebecf2] hover:bg-[#d9d9d9]"
                                onClick={() => removeMember(member.id)}>
                                <Minus className="h-3 w-3 text-[#ba0000]" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#576070]" />
                          <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            placeholder="Search for members..."
                            className="h-14 rounded-[5.46px] border border-[#E7F1F8] bg-[#ffffff] pl-12 text-base text-[#182233] shadow-sm placeholder:text-[#576070]"
                          />
                        </div>

                        {/* Members List */}
                        <div className="space-y-3">
                          {users
                            ?.filter((item) =>
                              item.name
                                .toLowerCase()
                                .trim()
                                .includes(searchTerm.trim().toLowerCase())
                            )
                            .map((member) => {
                              const isSelected = field.value.some(
                                (m) => m.id === member.id
                              );
                              return (
                                <div
                                  key={member.id}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleMember({
                                      avatar:
                                        (member.image as { id: string })?.id ||
                                        "",
                                      id: member.id,
                                      name: member.name,
                                      role: member.employeeRole,
                                    });
                                  }}
                                  className="flex cursor-pointer w-full items-center justify-between rounded-[5.46px] bg-[#f3f6f8] p-4 py-2 transition-colors hover:bg-[#ebecf2]">
                                  <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                      <AvatarImage
                                        src={""}
                                        alt={member.name}
                                        className="object-cover"
                                      />
                                      <AvatarFallback className="bg-brand text-white">
                                        {member.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                      <div className="text-lg font-semibold text-[#182233]">
                                        {member.name}
                                      </div>
                                      <div className="text-sm text-[#576070]">
                                        {member.employeeRole === "CUTTER"
                                          ? "Decoupeur"
                                          : member.employeeRole === "TAILOR"
                                          ? "Couteur"
                                          : member.employeeRole === "MANCHEUR"
                                          ? "Mancheur"
                                          : "Tapisier"}
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                      isSelected
                                        ? "bg-[#1e78ff]"
                                        : "border-2 border-[#d9d9d9] bg-[#ffffff]"
                                    }`}>
                                    {isSelected && (
                                      <Check className="h-4 w-4 text-[#ffffff]" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ScrollArea>
          )}
          {steps === 1 && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start w-full text-[#15091B]">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        type="text"
                        id="slogan"
                        className="w-full text-xs rounded-lg border border-[#A2ABBD] px-4 py-5 focus:outline-none 
                    focus:ring-0 placeholder:text-[#A2ABBD]"
                        placeholder="Nom de l’atelier"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <Button
          {...(steps === 1 && {
            onClick: (e) => {
              e.stopPropagation();
              e.preventDefault();
              setSteps(2);
            },
          })}
          disabled={isPending}
          type={steps === 1 ? "button" : "submit"}
          variant={"brand"}
          size={"lg"}
          className="w-full">
          {steps === 1
            ? "Suivant"
            : isPending
            ? "Création..."
            : "Créer l'atelier"}
        </Button>
      </form>
    </Form>
  );
}
