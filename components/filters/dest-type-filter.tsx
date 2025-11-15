"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import {
  DeskType,
  StockDisponibility,
  StockType,
  User,
  WorkShop,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  url: string;
}

function DeskTypeFilter({ searchParams, url: pathname }: Props) {
  const router = useRouter();
  const { onSearch, admin, desk } = useFilterModal();

  return (
    <Select
      onValueChange={(type) => {
        const { type: curr, ...rest } = desk;

        onSearch({
          admin,
          desk: {
            ...rest,
            type: type === "default" ? undefined : type,
          },
        });
      }}>
      <SelectTrigger className="w-32 bg-transparent border-[#E2E9EB] text-[#A2ABBD]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Par Default</SelectItem>
        <SelectItem value={DeskType.DEPOSIT}>Entrée</SelectItem>
        <SelectItem value={DeskType.WITHDRAWAL}>Sortie</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default DeskTypeFilter;
