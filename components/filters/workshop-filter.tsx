"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import { User, WorkShop } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
  workShops: WorkShop[];
  isPending?: boolean;
}

function WorkShopFilter({ workShops, isPending }: Props) {
  const router = useRouter();
  const { onSearch, admin, demand } = useFilterModal();

  return (
    <Select
      onValueChange={(workshop) => {
        const { workshop: curr, ...rest } = admin;

        onSearch({
          admin: {
            ...rest,
            workshop: workshop === "default" ? undefined : workshop,
          },
          demand,
        });
      }}>
      <SelectTrigger className="w-32 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Atelier" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Par Default</SelectItem>
        {isPending ? (
          <Loader2 className="h-5 w-5 text-brand animate-spin" />
        ) : (
          workShops.map((workshop) => (
            <SelectItem key={workshop.id} value={workshop.id}>
              {workshop.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default WorkShopFilter;
