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
import { OrderStage, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
  variants: ProductVariantWithPricing[];
}

function VariantsFilter({ searchParams, url: pathname, variants }: Props) {
  const router = useRouter();
  const { onSearch, data } = useFilterModal();

  return (
    <Select
      onValueChange={(variant) => {
        const { variant: curr, ...rest } = data.admin;

        onSearch({
          store: {},
          admin: {
            ...rest,
            variant: variant === "default" ? undefined : variant,
          },
        });
      }}>
      <SelectTrigger className="w-24 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent>
        <div className="space-y-1">
          <SelectItem
            value="default"
            className="bg-gray-100 hover:bg-gray-100 cursor-pointer">
            Par Default
          </SelectItem>
          {variants.map((variant) => (
            <SelectItem
              key={variant.id}
              value={variant.id}
              style={{
                backgroundColor: `${variant?.color}33`,
                color: `${variant?.color}`,
              }}
              className="cursor-pointer">
              {variant.name}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}

export default VariantsFilter;
