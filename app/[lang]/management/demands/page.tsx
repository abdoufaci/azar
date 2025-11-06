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
  const [stages, materials] = await Promise.all([
    getDemandStages(),
    getDemandMaterials(),
  ]);

  return (
    <div className="p-8">
      <DemandsInterface
        searchParams={await searchParams}
        stages={stages}
        materials={materials}
      />
    </div>
  );
}
