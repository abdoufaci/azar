"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import { DemandMaterial, ProductSubtype, User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
  materials: DemandMaterial[];
  isPending: boolean;
}

function MaterialFilter({
  searchParams,
  url: pathname,
  materials,
  isPending,
}: Props) {
  const router = useRouter();
  const { onSearch, admin, demand } = useFilterModal();

  return (
    <Select
      onValueChange={(material) => {
        const { material: curr, ...rest } = demand;

        onSearch({
          admin,
          demand: {
            ...rest,
            material: material === "default" ? undefined : material,
          },
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
          materials.map((material) => (
            <SelectItem key={material.id} value={material.id}>
              {material.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default MaterialFilter;
