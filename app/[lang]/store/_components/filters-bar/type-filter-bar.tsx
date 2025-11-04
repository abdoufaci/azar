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
  types: ProductSubtype[];
}

function TypeFilterBar({ lang, types }: Props) {
  const { onSearch, data } = useFilterModal();

  return (
    <Select
      onValueChange={(type) => {
        const { subtypeId, ...rest } = data.store;
        onSearch({
          store: {
            ...rest,
            subtypeId: type === "default" ? undefined : type,
          },
          admin: {},
        });
      }}>
      <SelectTrigger className="w-24 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder={lang === "ar" ? "النوع" : "Type"} />
      </SelectTrigger>
      <SelectContent>
        <div className="space-y-1">
          <SelectItem value="default">Par Default</SelectItem>
          {types.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}

export default TypeFilterBar;
