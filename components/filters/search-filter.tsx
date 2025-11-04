"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useFilterModal } from "@/hooks/use-filter-modal-store";

interface Props {
  url: string;
  searchParams: Record<string, string | string[] | undefined>;
}

export default function SearchFilter({ url: pathname, searchParams }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { onSearch, data } = useFilterModal();

  const { search, ...rest } = data.admin;

  useEffect(() => {
    onSearch({
      admin: {
        ...rest,
        search: searchTerm,
      },
      store: {},
    });
  }, [debouncedSearchTerm]);

  return (
    <div className="relative w-full flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A5A5A]" />
      <Input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.currentTarget.value);
        }}
        placeholder="Recherche"
        className="pl-10 bg-[#F3F6F8] border-none text-[#5A5A5A] placeholder:text-[#5A5A5A] w-full"
      />
    </div>
  );
}
