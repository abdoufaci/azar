"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSubtype, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
  types: ProductSubtype[];
}

function TypeFilter({ searchParams, url: pathname, types }: Props) {
  const router = useRouter();

  return (
    <Select
      onValueChange={(type) => {
        const { type: curr, page, ...rest } = searchParams;

        const url = qs.stringifyUrl(
          {
            url: pathname,
            query: {
              ...rest,
              type: type !== "default" ? type : null,
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
        {types.map((type) => (
          <SelectItem key={type.id} value={type.id}>
            {type.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default TypeFilter;
