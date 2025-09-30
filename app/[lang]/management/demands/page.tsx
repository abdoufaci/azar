import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { DemandesTable } from "./_components/demandes-table";
import SearchFilter from "@/components/filters/search-filter";
import WorkShopFilter from "@/components/filters/workshop-filter";
import TypeFilter from "@/components/filters/type-filter";
import PriorityFilter from "@/components/filters/priority-filter";
import StatusFilter from "@/components/filters/status-filter";
import { OpenDialogButton } from "@/components/open-dialog-button";

export default async function DemandesPage({
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium text-[#06191D]">Les Demandes</h1>
        </div>
        <div className="flex items-center justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-4 flex-1">
            <OpenDialogButton title="Ajouter Demande" type="manageDemand" />
            <SearchFilter
              url="/management/demands"
              searchParams={await searchParams}
            />
          </div>
          <div className="flex items-center gap-3">
            <WorkShopFilter
              url="/management/demands"
              searchParams={await searchParams}
            />
            <TypeFilter
              url="/management/demands"
              searchParams={await searchParams}
            />
            <PriorityFilter
              url="/management/demands"
              searchParams={await searchParams}
            />
            <StatusFilter
              url="/management/demands"
              searchParams={await searchParams}
            />
          </div>
        </div>
        <DemandesTable />
      </div>
    </div>
  );
}
