"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StockDisponibility, StockType, User, WorkShop } from "@prisma/client";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
}

function StockStatusFilter({ searchParams, url: pathname }: Props) {
  const router = useRouter();

  return (
    <Select
      onValueChange={(disponibility) => {
        const { disponibility: curr, page, ...rest } = searchParams;

        const url = qs.stringifyUrl(
          {
            url: pathname,
            query: {
              ...rest,
              disponibility: disponibility !== "default" ? disponibility : null,
            },
          },
          { skipNull: true }
        );
        router.push(url);
      }}>
      <SelectTrigger className="w-32 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Par Default</SelectItem>
        <SelectItem value={StockDisponibility.IN_STOCK}>Disponible</SelectItem>
        <SelectItem value={StockDisponibility.LIMITED}>Faible</SelectItem>
        <SelectItem value={StockDisponibility.OUT_OF_STOCK}>
          No Dispo
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export default StockStatusFilter;
