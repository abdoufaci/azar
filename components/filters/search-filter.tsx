"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFilterModal } from "@/hooks/use-filter-modal-store";

interface Props {
  url?: string;
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function SearchFilter({ url: pathname, searchParams }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { onSearch, admin, demand } = useFilterModal();

  const { search, ...rest } = admin;

  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    onSearch({
      demand,
      admin: {
        ...rest,
        search: search === "" ? undefined : searchTerm,
      },
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
