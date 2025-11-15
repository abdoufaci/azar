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
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
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
  PenLine,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
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
import { SupplierProductInTable, UserWithWorkshop } from "@/types/types";
import { updateClient } from "@/actions/mutations/users/update-client";
import { manageCart } from "@/actions/mutations/cart/manage-cart";
import { useCartQuery } from "@/hooks/use-cart-query";
import { usePathname } from "next/navigation";
import { Supplier, SupplierProduct, Supply, WareHouse } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { addSupplier } from "@/actions/mutations/supply/add-supplier";
import { addWareHouse } from "@/actions/mutations/stock/add-ware-house";
import { ManageSupplierProductModal } from "../modals/manage-supplier-product-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { truncate } from "@/lib/truncate";
import { DeleteSupplierProductModal } from "../modals/delete-supplier-product-modal";
import { addSupply } from "@/actions/mutations/supply/add-supply";

interface Props {
  setStep: Dispatch<SetStateAction<1 | 2>>;
  step: 1 | 2;
}

export function ManageSupplyForm({ setStep, step }: Props) {
  const { data, onClose } = useModal();
  const [newSupplierInput, setNewSupplierInput] = useState("");
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showAddWareHouse, setShowAddWareHouse] = useState(false);
  const [isAddingSupplierPending, startAddingTissue] = useTransition();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWareHouses] = useState<WareHouse[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [selectedWareHouse, setSelectedWareHouse] = useState<WareHouse | null>(
    null
  );
  const [isAddingWareHousePending, startAddingWareHouse] = useTransition();
  const [newWareHouseInput, setNewWareHouseInput] = useState("");
  const [products, setProducts] = useState<SupplierProductInTable[]>([]);
  const [productToEdit, setProductToEdit] =
    useState<SupplierProductInTable | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { suppliers: intialSuppliers, warehouses: intialWarehouses } = data;

  useEffect(() => {
    setSuppliers(intialSuppliers ?? []);
  }, [intialSuppliers]);

  useEffect(() => {
    setWareHouses(intialWarehouses ?? []);
  }, [intialWarehouses]);

  const handleAddSupplier = async () => {
    startAddingTissue(() => {
      addSupplier(newSupplierInput)
        .then((res) => {
          setSuppliers((prev) => [res, ...prev]);
          setNewSupplierInput("");
          setShowAddSupplier(false);
          toast.success("created !");
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  const handleAddWareHouse = () => {
    startAddingWareHouse(() => {
      addWareHouse(newWareHouseInput)
        .then((res) => {
          setWareHouses((prev) => [res, ...prev]);
          setNewWareHouseInput("");
          setShowAddWareHouse(false);
          toast.success("created !");
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  const onAddSupply = () => {
    startTransition(() => {
      addSupply({
        products,
        supplierId: selectedSupplier?.id ?? "",
        wareHouseId: selectedWareHouse?.id ?? "",
      })
        .then((res) => {
          data.onAddSupply?.(res);
          toast.success("Success .");
          onClose();
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  if (step === 1) {
    return (
      <div className="space-y-5">
        <div className="space-y-2">
          <h1 className="text-[#182233]">Fournisseur</h1>
          <Popover>
            <PopoverTrigger asChild>
              <div className="h-fit relative w-full max-w-full min-w-fit border border-[#CFCFCF] cursor-pointer rounded-lg bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none flex justify-between items-center">
                <div className="flex flex-col items-end space-y-1">
                  <span
                    className={cn(!!selectedSupplier ? "" : "text-[#A2ABBD]")}>
                    {!!selectedSupplier
                      ? `${selectedSupplier.name}`
                      : "Fournisseur"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 sm:!w-[527px] w-full" align="start">
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

                <ScrollArea className="h-40">
                  <div className="space-y-1">
                    {suppliers
                      ?.filter((supplier) =>
                        searchTerm === ""
                          ? true
                          : supplier.name
                              .toLowerCase()
                              .trim()
                              .includes(searchTerm.toLowerCase().trim())
                      )
                      ?.map((supplier) => {
                        return (
                          <div
                            key={supplier.id}
                            onClick={() => {
                              setSelectedSupplier(supplier);
                            }}
                            className="flex items-center gap-2 border-b p-4 cursor-pointer">
                            <h1 className="text-[#232323]">{supplier.name}</h1>
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>
                <div className="px-4 pb-2">
                  {showAddSupplier ? (
                    <Input
                      className="mb-2"
                      disabled={isAddingSupplierPending}
                      type="text"
                      placeholder="ex: Hamid"
                      value={newSupplierInput}
                      onChange={(e) => setNewSupplierInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation();
                          e.preventDefault();
                          handleAddSupplier();
                        }
                      }}
                    />
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setShowAddSupplier(true)}
                      variant="brand_link"
                      className="!p-0">
                      <Plus className="h-4 w-4" />
                      Ajouter Fournisseur
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <h1 className="text-[#182233]">Dépot</h1>
          <Popover>
            <PopoverTrigger asChild>
              <div className="h-fit relative w-full max-w-full min-w-fit border border-[#CFCFCF] cursor-pointer rounded-lg bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none flex justify-between items-center">
                <div className="flex flex-col items-end space-y-1">
                  <span
                    className={cn(!!selectedWareHouse ? "" : "text-[#A2ABBD]")}>
                    {!!selectedWareHouse
                      ? `${selectedWareHouse?.name}`
                      : "Dépot de Produit"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 sm:!w-[527px] w-full" align="start">
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
                {
                  <ScrollArea className="h-40">
                    <div className="space-y-1">
                      {warehouses
                        ?.filter((warehouse) =>
                          searchTerm === ""
                            ? true
                            : warehouse.name
                                .toLowerCase()
                                .trim()
                                .includes(searchTerm.toLowerCase().trim())
                        )
                        ?.map((warehouse) => {
                          return (
                            <div
                              key={warehouse.id}
                              onClick={() => {
                                setSelectedWareHouse(warehouse);
                              }}
                              className="flex items-center gap-2 border-b p-4 cursor-pointer">
                              <h1 className="text-[#232323]">
                                {warehouse.name}
                              </h1>
                            </div>
                          );
                        })}
                    </div>
                  </ScrollArea>
                }
                <div className="px-4 pb-2">
                  {showAddWareHouse ? (
                    <Input
                      className="mb-2"
                      disabled={isAddingWareHousePending}
                      type="text"
                      placeholder="ex: Ouled belhadj"
                      value={newWareHouseInput}
                      onChange={(e) => setNewWareHouseInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation();
                          e.preventDefault();
                          handleAddWareHouse();
                        }
                      }}
                    />
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setShowAddWareHouse(true)}
                      variant="brand_link"
                      className="!p-0">
                      <Plus className="h-4 w-4" />
                      Ajouter Dépot
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Button
          size={"lg"}
          variant={"brand"}
          className="w-full"
          disabled={!selectedSupplier || !selectedWareHouse}
          onClick={() => setStep(2)}>
          continue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ManageSupplierProductModal
        addProductOptimitic={(item) => setProducts((prev) => [item, ...prev])}
        updateProductOptimitic={(item) =>
          setProducts((prev) => {
            let curr = prev;
            const idx = curr.findIndex((product) => product.id === item.id);
            curr[idx] = { ...item };
            return curr;
          })
        }
        onClose={() => {
          setProductToEdit(null);
          setIsOpen(false);
        }}
        isModalOpen={isOpen}
        product={productToEdit}
      />
      {!!productToEdit && (
        <DeleteSupplierProductModal
          deleteProductOptimistic={() =>
            setProducts((prev) =>
              prev.filter((item) => item.id !== productToEdit.id)
            )
          }
          onClose={() => {
            setProductToEdit(null);
            setIsDeleteOpen(false);
          }}
          isModalOpen={isDeleteOpen}
          product={productToEdit}
        />
      )}
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <h3 className="text-[#182233]">Depuis</h3>
          <h3 className="text-[#06191D] font-semibold">
            {selectedSupplier?.name}
          </h3>
          <h3 className="text-[#182233]">à dépot de</h3>
          <h3 className="text-[#06191D] font-semibold">
            {selectedWareHouse?.name}
          </h3>
        </div>
        <Button onClick={() => setIsOpen(true)} variant={"brandOutline"}>
          <Plus className="h-5 w-5" />
          Ajouter un produit
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="text-[#64748B] font-normal p-5">
                Produit
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                Type
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                Quantite
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                prix unitaire
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                Total
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, idx) => (
              <TableRow
                key={product.id}
                className="border-border hover:bg-muted/30 cursor-pointer">
                <TableCell className="text-[#576070] p-5">
                  <HoverCard>
                    <HoverCardTrigger>
                      {truncate(product.name, 15)}
                    </HoverCardTrigger>
                    <HoverCardContent className="w-full">
                      <p className="w-full max-w-sm font-medium">
                        {product.name}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <div
                      style={{
                        backgroundColor: `${product.type?.color}33`,
                        color: `${product.type?.color}`,
                      }}
                      className="px-3 py-1.5 rounded-full font-medium text-xs">
                      {product.type?.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-[#95A1B1] text-center">
                  {product.quantity}
                </TableCell>
                <TableCell className="text-[#06191D] font-medium p-5 text-center">
                  {product.unitPrice} da
                </TableCell>
                <TableCell className="text-[#95A1B1] text-center">
                  {product.quantity * product.unitPrice} da
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                        setProductToEdit(product);
                      }}
                      className="h-8 w-8 p-0 text-[#8E8E8E] hover:text-[#8E8E8E]">
                      <PenLine className="h-4 w-4" />
                      <span className="sr-only">Edit product</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteOpen(true);
                        setProductToEdit(product);
                      }}
                      className="h-8 w-8 p-0 text-[#CE2A2A] hover:text-[#CE2A2A]">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete product</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!!products.length && (
        <div className="flex items-center justify-end gap-5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg">Total</h1>
            <h3 className="text-brand text-lg font-medium">
              {products.reduce(
                (acc, product) => acc + product.quantity * product.unitPrice,
                0
              )}{" "}
              da
            </h3>
          </div>
          <Button
            disabled={isPending}
            onClick={onAddSupply}
            variant={"brand"}
            size={"lg"}
            className="sm:!w-56">
            Confirmé
          </Button>
        </div>
      )}
    </div>
  );
}
