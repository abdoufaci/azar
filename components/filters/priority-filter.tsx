"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import { DemandPriority, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
}

function PriorityFilter({ searchParams, url: pathname }: Props) {
  const router = useRouter();
  const { onSearch, admin, demand } = useFilterModal();

  return (
    <Select
      onValueChange={(priority) => {
        const { priority: curr, ...rest } = demand;

        onSearch({
          admin,
          demand: {
            ...rest,
            priority: priority === "default" ? undefined : priority,
          },
        });
      }}>
      <SelectTrigger className="w-28 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Priorité" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Par Default</SelectItem>
        <SelectItem value={DemandPriority.URGENT}>Urgent</SelectItem>
        <SelectItem value={DemandPriority.NORMAL}>Normal</SelectItem>
        <SelectItem value={DemandPriority.WEAK}>Faible</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default PriorityFilter;
