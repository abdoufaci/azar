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
import { EmplyeeRole, UserRole, WorkShop } from "@prisma/client";
import { addEmployee } from "@/actions/mutations/users/add-employee";
import { UserInTable, UserWithWorkshop } from "@/types/types";
import { updateEmployee } from "@/actions/mutations/users/update-employee";
import { useWorkShopsQuery } from "@/hooks/use-workshops-query";

export const ManageEmployeeformSchema = z.object({
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  password: z.string().optional(),
  username: z.string(),
  role: z.enum([
    EmplyeeRole.CHEF,
    EmplyeeRole.CUTTER,
    EmplyeeRole.TAILOR,
    EmplyeeRole.TAPISIER,
    EmplyeeRole.MANCHEUR,
    UserRole.ADMIN,
  ]),
  workshop: z.object({
    name: z.string(),
    id: z.string(),
  }),
});

interface Props {
  onCancel: () => void;
  user: UserWithWorkshop | null;
  workshop?: WorkShop | null;
  addUserOptimistic: (user: UserInTable) => void;
  updateUserOptimistic: (user: UserInTable) => void;
}

export function ManageEmployeeForm({
  onCancel,
  user,
  workshop,
  addUserOptimistic,
  updateUserOptimistic,
}: Props) {
  const { data: workshops, isPending: isFetchingWorkShops } =
    useWorkShopsQuery();
  const form = useForm<z.infer<typeof ManageEmployeeformSchema>>({
    resolver: zodResolver(ManageEmployeeformSchema),
    defaultValues: {
      address: user?.address,
      name: user?.name,
      phone: user?.phone,
      role: user?.role === "ADMIN" ? "ADMIN" : user?.employeeRole,
      username: user?.username,
      workshop: user?.workShopId
        ? {
            id: user?.workShopId || workshop?.id || "",
            name: user?.workShop?.name || workshop?.name || "",
          }
        : undefined,
    },
  });
  const [isPending, startTransition] = useTransition();
  const [isUsernamePending, startUsernameTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(true);
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "available" | "taken" | null
  >(null);
  const [imagesToDelete, setImagesToDelete] = useState<
    { id: string; type: string }[]
  >([]);

  const watchedValue = form.watch("username");
  const debouncedValue = useDebounce(watchedValue, 500);

  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedValue || debouncedValue.length < 3) {
        setAvailabilityStatus(null);
        return;
      }
      setAvailabilityStatus(null);
      startUsernameTransition(() => {
        checkUsernameAvailability(debouncedValue)
          .then((isAvailable) => {
            setAvailabilityStatus(!isAvailable ? "available" : "taken");
          })
          .catch((error) => console.error("Error checking username:", error));
      });
    };

    checkUsername();
  }, [debouncedValue, form]);

  const getStatusIcon = () => {
    if (isUsernamePending) {
      return <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />;
    }

    if (availabilityStatus === "available") {
      return <Check className="h-4 w-4 text-green-500" />;
    }

    if (availabilityStatus === "taken") {
      return (
        <XIcon
          onClick={() => form.setValue("username", "")}
          className="h-4 w-4 text-red-500 cursor-pointer"
        />
      );
    }

    return null;
  };

  async function onSubmit(data: z.infer<typeof ManageEmployeeformSchema>) {
    startTransition(() => {
      user
        ? updateEmployee(data, user)
            .then((res) => {
              updateUserOptimistic(res);
              toast.success("Employé est modifier avec succès");
              onCancel();
            })
            .catch(() => toast.error("Erreur"))
        : addEmployee(data)
            .then((res) => {
              //@ts-ignore
              addUserOptimistic(res);
              toast.success("Employeé est crée avec succès");
              onCancel();
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
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full text-[#15091B]">
                <FormLabel
                  htmlFor="slogan"
                  className="text-[#182233] text-lg font-normal">
                  Rôle
                </FormLabel>
                <FormControl className="w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-between w-full rounded-lg h-fit border border-[#A2ABBD] px-4 py-3 focus:outline-none">
                      <div className="flex flex-col text-start">
                        {field.value ? (
                          <p className="text-sm">
                            {field.value === "ADMIN"
                              ? "Admin"
                              : field.value === "CHEF"
                              ? "chef"
                              : field.value === "CUTTER"
                              ? "Decoupeur"
                              : field.value === "TAILOR"
                              ? "Couteur"
                              : field.value === "MANCHEUR"
                              ? "Mancheur"
                              : "Tapisier"}
                          </p>
                        ) : (
                          <p className="text-sm text-[#A2ABBD]">
                            Rôle d&apos;employée
                          </p>
                        )}
                      </div>
                      <ChevronDown className="size-4 text-[#A7ABAF]" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[350px] sm:!w-[576px]">
                      <DropdownMenuItem
                        onClick={() => {
                          field.onChange(UserRole.ADMIN);
                        }}
                        className="hover:cursor-pointer w-full">
                        Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          field.onChange(EmplyeeRole.CHEF);
                        }}
                        className="hover:cursor-pointer w-full">
                        Chef
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          field.onChange(EmplyeeRole.CUTTER);
                        }}
                        className="hover:cursor-pointer w-full">
                        Decoupeur
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          field.onChange(EmplyeeRole.TAILOR);
                        }}
                        className="hover:cursor-pointer w-full">
                        Couteur
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          field.onChange(EmplyeeRole.TAPISIER);
                        }}
                        className="hover:cursor-pointer w-full">
                        Tapisier
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workshop"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full text-[#15091B]">
                <FormLabel
                  htmlFor="slogan"
                  className="text-[#182233] text-lg font-normal">
                  L’atelier
                </FormLabel>
                <FormControl className="w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-between w-full rounded-lg h-fit border border-[#A2ABBD] px-4 py-3 focus:outline-none">
                      <div className="flex flex-col text-start">
                        {field.value ? (
                          <p className="text-sm">{field.value.name}</p>
                        ) : (
                          <p className="text-sm text-[#A2ABBD]">
                            L’atelier assigné
                          </p>
                        )}
                      </div>
                      <ChevronDown className="size-4 text-[#A7ABAF]" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[350px] sm:!w-[576px]">
                      {isFetchingWorkShops ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 text-brand animate-spin" />
                        </div>
                      ) : (
                        workshops.map((workshop) => (
                          <DropdownMenuItem
                            key={workshop.id}
                            onClick={() => {
                              field.onChange({
                                id: workshop.id,
                                name: workshop.name,
                              });
                            }}
                            className="hover:cursor-pointer w-full">
                            {workshop.name}
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full text-[#15091B]">
                <FormLabel
                  htmlFor="slogan"
                  className="text-[#182233] text-lg font-normal">
                  Nom
                </FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type="text"
                      id="slogan"
                      className="w-full text-xs rounded-lg border border-[#A2ABBD] px-4 py-5 focus:outline-none 
                    focus:ring-0 placeholder:text-[#A2ABBD]"
                      placeholder="Nom de client"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full text-[#15091B]">
                <FormLabel
                  htmlFor="password"
                  className="text-[#182233] text-lg font-normal">
                  Mot de pass
                </FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full text-xs rounded-lg border border-[#A2ABBD] px-4 py-5 pr-20 focus:outline-none 
                      focus:ring-0 placeholder:text-[#A2ABBD]"
                      placeholder="Mot de pass de compte"
                      {...field}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => {
                          const password = generateRandomPassword();
                          form.setValue("password", password);
                        }}
                        title="Generate random password">
                        <RefreshCcw className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                        title={
                          showPassword ? "Hide password" : "Show password"
                        }>
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"username"}
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full">
                <FormLabel
                  htmlFor="username"
                  className={cn(
                    "text-[#182233] text-lg font-normal",
                    availabilityStatus === "available"
                      ? "text-green-600"
                      : availabilityStatus === "taken" && "text-red-600"
                  )}>
                  Psuedo
                </FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value.toLowerCase())
                      }
                      type="text"
                      className={cn(
                        "w-full text-xs rounded-lg border border-[#A2ABBD] px-4 py-5 focus:outline-none focus:ring-0 placeholder:text-[#A2ABBD]",
                        availabilityStatus === "available"
                          ? "border-green-600"
                          : availabilityStatus === "taken"
                          ? "border-red-600"
                          : "border-[#CFCFCF]"
                      )}
                      placeholder="Username"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {getStatusIcon()}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full text-[#15091B]">
                <FormLabel
                  htmlFor="slogan"
                  className="text-[#182233] text-lg font-normal">
                  Numero
                </FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type="number"
                      id="slogan"
                      className="w-full text-xs rounded-lg border border-[#A2ABBD] px-4 py-5 focus:outline-none 
                    focus:ring-0 placeholder:text-[#A2ABBD]"
                      placeholder="Numero de client"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full text-[#15091B]">
                <FormLabel
                  htmlFor="slogan"
                  className="text-[#182233] text-lg font-normal">
                  Address
                </FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type="text"
                      id="slogan"
                      className="w-full text-xs rounded-lg border border-[#A2ABBD] px-4 py-5 focus:outline-none 
                    focus:ring-0 placeholder:text-[#A2ABBD]"
                      placeholder="Address de client"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-between w-full gap-5">
          <Button
            onClick={onCancel}
            type="button"
            variant={"link"}
            className="underline">
            Cancel
          </Button>
          <Button
            disabled={
              isPending || (availabilityStatus !== "available" && !user)
            }
            type="submit"
            variant={"brand"}
            size={"lg"}
            className="rounded-full">
            {user ? "mise a jour" : "créer"} un employée
          </Button>
        </div>
      </form>
    </Form>
  );
}
