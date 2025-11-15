"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import { Supplier, User, WareHouse, WorkShop } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  suppliers: Supplier[];
  isPending?: boolean;
}

function SupplierFilter({ suppliers, isPending }: Props) {
  const router = useRouter();
  const { onSearch, admin, desk, supply } = useFilterModal();

  return (
    <Select
      onValueChange={(supplier) => {
        const { supplier: curr, ...rest } = supply;

        onSearch({
          admin,
          desk,
          supply: {
            ...rest,
            supplier: supplier === "default" ? undefined : supplier,
          },
        });
      }}>
      <SelectTrigger className="w-32 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Fourniseur" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Par Default</SelectItem>
        {isPending ? (
          <Loader2 className="h-5 w-5 text-brand animate-spin" />
        ) : (
          suppliers.map((supplier) => (
            <SelectItem key={supplier.id} value={supplier.id}>
              {supplier.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default SupplierFilter;
