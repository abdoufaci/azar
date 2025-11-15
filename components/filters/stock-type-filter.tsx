"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import { StockType, User, WorkShop } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
  types: StockType[];
  isPending?: boolean;
}

function StockTypeFilter({ types, isPending = false }: Props) {
  const router = useRouter();
  const { onSearch, admin, stock } = useFilterModal();

  return (
    <Select
      onValueChange={(type) => {
        const { type: curr, ...rest } = admin;

        onSearch({
          admin: {
            ...rest,
            type: type === "default" ? undefined : type,
          },
          stock,
        });
      }}>
      <SelectTrigger className="w-32 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Par Default</SelectItem>
        {isPending ? (
          <SelectItem value="default">
            <Loader2 className="h-5 w-5 text-brand animate-spin" />
          </SelectItem>
        ) : (
          types.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default StockTypeFilter;
