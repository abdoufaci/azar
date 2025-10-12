"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DemandMaterial, ProductSubtype, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
  materials: DemandMaterial[];
}

function MaterialFilter({ searchParams, url: pathname, materials }: Props) {
  const router = useRouter();

  return (
    <Select
      onValueChange={(material) => {
        const { material: curr, page, ...rest } = searchParams;

        const url = qs.stringifyUrl(
          {
            url: pathname,
            query: {
              ...rest,
              material: material !== "default" ? material : null,
            },
          },
          { skipNull: true }
        );
        router.push(url);
      }}>
      <SelectTrigger className="w-24 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Par Default</SelectItem>
        {materials.map((material) => (
          <SelectItem key={material.id} value={material.id}>
            {material.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default MaterialFilter;
