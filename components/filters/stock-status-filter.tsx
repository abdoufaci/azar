"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import { StockDisponibility, StockType, User, WorkShop } from "@prisma/client";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
}

function StockStatusFilter({ searchParams, url: pathname }: Props) {
  const router = useRouter();
  const { onSearch, admin, stock } = useFilterModal();

  return (
    <Select
      onValueChange={(disponibility) => {
        const { disponibility: curr, ...rest } = stock;
        onSearch({
          admin,
          stock: {
            ...rest,
            disponibility:
              disponibility === "default" ? undefined : disponibility,
          },
        });
      }}>
      <SelectTrigger className="w-32 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Par Default</SelectItem>
        <SelectItem value={StockDisponibility.IN_STOCK}>Disponible</SelectItem>
        <SelectItem value={StockDisponibility.LIMITED}>Faible</SelectItem>
        <SelectItem value={StockDisponibility.OUT_OF_STOCK}>
          Non Dispo
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export default StockStatusFilter;
