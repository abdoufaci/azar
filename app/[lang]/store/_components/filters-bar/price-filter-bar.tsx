"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import { ProductVariantWithPricing } from "@/types/types";
import { ProductSubtype } from "@prisma/client";

interface Props {
  lang: any;
}

function PriceFilterBar({ lang }: Props) {
  const { onSearch, data } = useFilterModal();

  return (
    <Select
      onValueChange={(minPrice) => {
        const { price, ...rest } = data;
        onSearch({
          ...rest,
          price:
            minPrice === "default"
              ? undefined
              : {
                  min: Number(minPrice),
                  max: Number(minPrice) + 50000,
                },
        });
      }}>
      <SelectTrigger className="w-24 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder={lang === "ar" ? "السعر" : "Price"} />
      </SelectTrigger>
      <SelectContent>
        <div className="space-y-1">
          <SelectItem value="default">Par Default</SelectItem>
          <SelectItem value="0">0-5m</SelectItem>
          <SelectItem value="50000">5m-10m</SelectItem>
          <SelectItem value="100000">10m-15m</SelectItem>
          <SelectItem value="150000">15m-20m</SelectItem>
          <SelectItem value="200000">20m-25m</SelectItem>
          <SelectItem value="250000">25m-30m</SelectItem>
        </div>
      </SelectContent>
    </Select>
  );
}

export default PriceFilterBar;
