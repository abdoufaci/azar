"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import { useVariantsQuery } from "@/hooks/use-variants-query";
import { ProductVariantWithPricing } from "@/types/types";
import { OrderStage, User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams?: Record<string, string | string[] | undefined>;
  url?: string;
  variants: ProductVariantWithPricing[];
  isPending: boolean;
}

function VariantsFilter({
  searchParams,
  url: pathname,
  variants,
  isPending,
}: Props) {
  const router = useRouter();
  const { onSearch, admin } = useFilterModal();

  return (
    <Select
      onValueChange={(variant) => {
        const { variant: curr, ...rest } = admin;

        onSearch({
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
          {isPending ? (
            <SelectItem value="default">
              <Loader2 className="h-5 w-5 text-brand animate-spin" />
            </SelectItem>
          ) : (
            variants.map((variant) => (
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
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  );
}

export default VariantsFilter;
