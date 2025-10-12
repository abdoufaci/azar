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
import { getWorkshops } from "@/actions/queries/workshop/get-workshops";
import { getDemands } from "@/actions/queries/demands/get-demands";
import { getDemandsCount } from "@/actions/queries/demands/get-demands-count";
import { getDemandStages } from "@/actions/queries/demands/get-demand-stages";
import DemandsInterface from "./_components/demands-interface";
import { getDemandMaterials } from "@/actions/queries/demands/get-demand-materials";

export default async function DemandesPage({
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const currentPage = (await searchParams).page;
  const demandsPerPage = 8;
  const workshops = await getWorkshops();
  const demands = await getDemands(
    Number(currentPage || "1"),
    demandsPerPage,
    searchParams
  );
  const totalDemands = await getDemandsCount(searchParams);
  const stages = await getDemandStages();
  const materials = await getDemandMaterials();

  return (
    <div className="p-8">
      <DemandsInterface
        currentPage={Number(currentPage || "1")}
        demandsPerPage={demandsPerPage}
        demands={demands}
        searchParams={await searchParams}
        stages={stages}
        totalDemands={totalDemands}
        workShops={workshops}
        materials={materials}
      />
    </div>
  );
}
