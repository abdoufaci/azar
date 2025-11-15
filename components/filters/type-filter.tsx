"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import { useTypesQuery } from "@/hooks/use-types-query";
import { ProductSubtype, User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams?: Record<string, string | string[] | undefined>;
  url?: string;
  types: ProductSubtype[];
  isPending: boolean;
}

function TypeFilter({ types, isPending }: Props) {
  const router = useRouter();
  const { onSearch, admin, demand } = useFilterModal();

  return (
    <Select
      onValueChange={(type) => {
        const { type: curr, ...rest } = admin;

        onSearch({
          admin: {
            ...rest,
            type: type === "default" ? undefined : type,
          },
          demand,
        });
      }}>
      <SelectTrigger className="w-24 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
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

export default TypeFilter;
