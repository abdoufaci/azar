"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
}

function PriorityFilter({ searchParams, url: pathname }: Props) {
  const router = useRouter();

  return (
    <Select
      onValueChange={(priority) => {
        const { priority: curr, ...rest } = searchParams;

        const url = qs.stringifyUrl(
          {
            url: pathname,
            query: {
              ...rest,
              priority: priority !== "default" ? priority : null,
            },
          },
          { skipNull: true }
        );
        router.push(url);
      }}>
      <SelectTrigger className="w-28 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Priorité" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Par Default</SelectItem>
        <SelectItem value="urgent">Urgent</SelectItem>
        <SelectItem value="normal">Normal</SelectItem>
        <SelectItem value="faible">Faible</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default PriorityFilter;
