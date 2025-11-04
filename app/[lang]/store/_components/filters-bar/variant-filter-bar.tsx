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

interface Props {
  lang: any;
  variants: ProductVariantWithPricing[];
}

function VariantFilterBar({ lang, variants }: Props) {
  const { onSearch, store } = useFilterModal();

  return (
    <Select
      onValueChange={(variant) => {
        const { variantId, ...rest } = store;
        onSearch({
          store: {
            ...rest,
            variantId: variant === "default" ? undefined : variant,
          },
        });
      }}>
      <SelectTrigger className="w-24 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder={lang === "ar" ? "المودال" : "Model"} />
      </SelectTrigger>
      <SelectContent>
        <div className="space-y-1">
          <SelectItem value="default">Par Default</SelectItem>
          {variants.map((variant) => (
            <SelectItem key={variant.id} value={variant.id}>
              {variant.name}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}

export default VariantFilterBar;
