"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useFilterModal } from "@/hooks/use-filter-modal-store";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  lang: any;
}

function SearchFilterBar({ lang }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { onSearch } = useFilterModal();

  useEffect(() => {
    const fetchProducts = async () => {
      onSearch({
        store: {
          search: searchTerm,
        },
      });
    };
    fetchProducts();
  }, [debouncedSearchTerm]);

  return (
    <div className="relative w-full max-w-md">
      <Search
        className={cn(
          "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A5A5A]",
          lang === "ar" ? "right-3" : "left-3"
        )}
      />
      <Input
        className={cn(
          "w-full border-none rounded-sm focus-visible:ring-0 bg-[#F6F6F6]",
          lang === "ar" ? "pr-10" : "pl-10"
        )}
        placeholder={lang === "ar" ? "...البحث" : "Search..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default SearchFilterBar;
