import { addDemandStage } from "@/actions/mutations/demand/add-demand-stage";
import { updateDemandStage } from "@/actions/mutations/demand/update-demand-stage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SheetClose } from "@/components/ui/sheet";
import { useDemandHistoryQuery } from "@/hooks/admin/use-demand-history-query";
import { useDemandsQuery } from "@/hooks/admin/use-query-demands";
import { cn } from "@/lib/utils";
import { DemandInTable } from "@/types/types";
import { DemandStage } from "@prisma/client";
import { format } from "date-fns";
import { ChevronLeft, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  demand: DemandInTable;
  stages: DemandStage[];
  updateStageOptimistic: (stage: DemandStage) => void;
}

function DemandDetails({ demand, stages, updateStageOptimistic }: Props) {
  const [newDemandStageInput, setNewDemandStageInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [isAddingDemandStagePending, startAddingDemandStage] = useTransition();
  const [isPending, startTransition] = useTransition();

  const { data: history, isPending: isFetchingDemandHistory } =
    useDemandHistoryQuery({
      demandId: demand.id,
    });

  const { refetch } = useDemandsQuery();

  const handleAddDemandStage = () => {
    startAddingDemandStage(() => {
      addDemandStage(newDemandStageInput)
        .then(() => {
          refetch();
          setNewDemandStageInput("");
          setShowAdd(false);
          toast.success("created !");
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-5">
        <SheetClose>
          <div className="flex items-center gap-1">
            <ChevronLeft className="h-5 w-5 text-[#576070]" />
            <div className="flex items-center justify-start gap-1.5">
              <Image
                alt="workshop"
                src={demand.workshop?.image || "/workshop2.svg"}
                width={25}
                height={25}
                className="rounded-lg object-cover mt-1"
              />
              <h1 className="text-[#182233]">{demand.workshop?.name}</h1>
            </div>
          </div>
        </SheetClose>
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <h3 className="text-[#95A1B1] font-medium text-xs">
            {demand.demandId}
          </h3>
          <div className="flex items-center gap-4">
            <div
              style={{
                backgroundColor: `${demand.material.color}33`,
                color: `${demand.material.color}`,
              }}
              className="rounded-full px-4 py-1.5 text-xs font-medium">
              {demand.material.name}
            </div>
            <div
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium",
                demand.priority === "NORMAL"
                  ? "text-[#21D954] bg-[#21D95426]"
                  : demand.priority === "URGENT"
                  ? "text-[#BA0000] bg-[#BA000026]"
                  : "text-[#FFD12E] bg-[#FFD12E26]"
              )}>
              {demand.priority === "NORMAL"
                ? "Normal"
                : demand.priority === "URGENT"
                ? "Urgent"
                : "faible"}
            </div>
          </div>
          <p className="text-[#576070] text-sm">{demand.demand}</p>
        </div>
        <Separator className="w-full" />
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-[#576070] font-medium text-sm">Crée par</h1>
          <div className="rounded-full p-1 border border-[#EBECF2] flex items-center gap-1.5 pr-2">
            <Avatar className="w-6 h-6 flex items-center justify-center">
              <AvatarImage
                className="object-cover"
                src={`https://${process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME}/${
                  //@ts-ignore
                  demand.user?.image?.id
                }`}
              />
              <AvatarFallback className="bg-brand text-white flex items-center justify-center">
                {demand.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-sm font-medium text-[#182233]">
              {demand.user?.name}
            </h1>
            <h3 className="text-xs font-medium text-[#95A1B1]">
              {format(demand?.createdAt || new Date(), "HH:mm dd/MM/yyyy")}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-[#576070] font-medium text-sm">Status</h1>
          <Popover>
            <PopoverTrigger
              onClick={(e) => {
                e.stopPropagation();
              }}>
              <div
                style={{
                  backgroundColor: `${demand.stage?.color}21`,
                }}
                className="px-3 py-1.5 rounded-[3.96px] font-medium text-xs flex items-center gap-3 text-[#182233]">
                <div
                  style={{
                    backgroundColor: `${demand.stage?.color}`,
                  }}
                  className="w-3 h-3 rounded-full"
                />
                <h1>{demand.stage?.name}</h1>
                <svg
                  width="6"
                  height="4"
                  viewBox="0 0 6 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.579325 1.65403L2.41548 3.49018C2.48106 3.55591 2.55897 3.60805 2.64473 3.64362C2.73049 3.6792 2.82243 3.69751 2.91528 3.69751C3.00813 3.69751 3.10007 3.6792 3.18583 3.64362C3.27159 3.60805 3.3495 3.55591 3.41508 3.49018L5.25124 1.65403C5.69787 1.2074 5.37884 0.441745 4.74789 0.441745L1.07558 0.441745C0.444626 0.441745 0.132693 1.2074 0.579325 1.65403Z"
                    fill="#576070"
                  />
                </svg>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-fit">
              <div className="space-y-2">
                <div className="space-y-1">
                  {stages.map((stage) => (
                    <div
                      key={stage.id}
                      className="px-4 pt-3 flex items-center justify-center">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          startTransition(() => {
                            updateStageOptimistic(stage);
                            updateDemandStage({
                              demandId: demand.id,
                              stageId: stage.id,
                              oldStageId: demand.stageId,
                            }).catch(() => {
                              refetch();
                              toast.error("Erreur .");
                            });
                          });
                        }}
                        style={{
                          backgroundColor: `${stage?.color}33`,
                          color: `${stage?.color}`,
                        }}
                        className="px-3 py-1.5 rounded-[3.96px] font-medium text-xs cursor-pointer w-full max-w-32 flex items-center justify-center">
                        {stage?.name}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 pb-2">
                  {showAdd ? (
                    <Input
                      className="mb-2"
                      disabled={isAddingDemandStagePending}
                      type="text"
                      placeholder="ex: en cours.."
                      value={newDemandStageInput}
                      onChange={(e) => setNewDemandStageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent form submission on Enter for this input
                          handleAddDemandStage();
                        }
                      }}
                    />
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setShowAdd(true)}
                      variant="brand_link"
                      className="!p-0">
                      <Plus className="h-4 w-4" />
                      Ajouter Etat
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="space-y-5">
        <h1 className="font-medium text-[#06191D]">LOGS</h1>
        <div className="space-y-3">
          {isFetchingDemandHistory ? (
            <Loader2 className="text-brand animate-spin h-5 w-5" />
          ) : (
            history.map((action) => (
              <div
                key={action.id}
                className="flex items-start gap-0.5 font-medium">
                <h1 className="text-[#056BE4]">{action.user?.name} </h1>{" "}
                <h5>
                  changer le status{" "}
                  <span
                    style={{
                      color: action.oldStage?.color,
                    }}>
                    {action.oldStage?.name}{" "}
                  </span>{" "}
                  {"->"}{" "}
                  <span
                    style={{
                      color: action.newStage?.color,
                    }}>
                    {action.newStage?.name}{" "}
                  </span>
                </h5>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DemandDetails;
