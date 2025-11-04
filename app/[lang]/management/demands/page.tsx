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
  const [workshops, demands, totalDemands, stages, materials] =
    await Promise.all([
      getWorkshops(),
      getDemands({
        currentPage: Number(currentPage || "1"),
        demandsPerPage,
        searchParams,
      }),
      getDemandsCount({ searchParams }),
      getDemandStages(),
      getDemandMaterials(),
    ]);

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
