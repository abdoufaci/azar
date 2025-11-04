"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import { DemandStage, OrderStage, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
  stages: OrderStage[] | DemandStage[];
}

function StatusFilter({ searchParams, url: pathname, stages }: Props) {
  const router = useRouter();
  const { onSearch, admin, demand } = useFilterModal();

  return (
    <Select
      onValueChange={(status) => {
        const { status: curr, ...rest } = admin;

        onSearch({
          admin: {
            ...rest,
            status: status === "default" ? undefined : status,
          },
          demand,
        });
      }}>
      <SelectTrigger className="w-24 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Statut" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Par Default</SelectItem>
        {stages.map((stage) => (
          <SelectItem key={stage.id} value={stage.id}>
            {stage.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default StatusFilter;
