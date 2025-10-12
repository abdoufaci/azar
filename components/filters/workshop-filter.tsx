"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, WorkShop } from "@prisma/client";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
  workShops: WorkShop[];
}

function WorkShopFilter({ searchParams, url: pathname, workShops }: Props) {
  const router = useRouter();

  return (
    <Select
      onValueChange={(workshop) => {
        const { workshop: curr, page, ...rest } = searchParams;

        const url = qs.stringifyUrl(
          {
            url: pathname,
            query: {
              ...rest,
              workshop: workshop !== "default" ? workshop : null,
            },
          },
          { skipNull: true }
        );
        router.push(url);
      }}>
      <SelectTrigger className="w-32 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Atelier" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Par Default</SelectItem>
        {workShops.map((workshop) => (
          <SelectItem key={workshop.id} value={workshop.id}>
            {workshop.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default WorkShopFilter;
