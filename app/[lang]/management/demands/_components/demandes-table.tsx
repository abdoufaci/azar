import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { badgeVariant } from "@/constants/badge-var";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import qs from "query-string";
import { DemandInTable } from "@/types/types";
import { truncate } from "@/lib/truncate";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DemandStage } from "@prisma/client";
import { addDemandStage } from "@/actions/mutations/demand/add-demand-stage";
import { updateDemandStage } from "@/actions/mutations/demand/update-demand-stage";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DemandDetails from "./demand-details";
import { useDemandsQuery } from "@/hooks/admin/use-query-demands";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  stages: DemandStage[];
}

export function DemandesTable({ stages }: Props) {
  const [newDemandStageInput, setNewDemandStageInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [isAddingDemandStagePending, startAddingDemandStage] = useTransition();
  const [isPending, startTransition] = useTransition();

  const {
    data: demands,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    isPending: tanstackIsPending,
    refetch,
  } = useDemandsQuery();
  const [isFetchingPreviousPage, setIsFetchingPreviousPage] = useState(false);

  let currentDemands = demands;

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
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-[#64748B] font-normal p-5">
              Demande
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Atelier
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Type
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Priorité
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Statut
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Création
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              ID
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetchingNextPage || isFetchingPreviousPage || tanstackIsPending ? (
            <>
              <DemandesTable.Skeleton />
              <DemandesTable.Skeleton />
              <DemandesTable.Skeleton />
              <DemandesTable.Skeleton />
              <DemandesTable.Skeleton />
              <DemandesTable.Skeleton />
              <DemandesTable.Skeleton />
              <DemandesTable.Skeleton />
            </>
          ) : (
            demands?.pages[demands?.pages?.length - 1]?.demands?.map(
              (demande: DemandInTable, index: number) => (
                <Sheet key={demande.id}>
                  <SheetTrigger asChild>
                    <TableRow className="border-border hover:bg-muted/30 cursor-pointer">
                      <TableCell className="text-[#576070] p-5">
                        <HoverCard>
                          <HoverCardTrigger>
                            {truncate(demande.demand, 15)}
                          </HoverCardTrigger>
                          <HoverCardContent className="w-full">
                            <p className="w-full max-w-sm font-medium">
                              {demande.demand}
                            </p>
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                      <TableCell className="text-[#06191D] font-medium p-5 text-center">
                        <div className="flex items-start justify-center gap-1.5">
                          <Image
                            alt="workshop"
                            src={demande.workshop?.image || "/workshop2.svg"}
                            width={25}
                            height={25}
                            className="rounded-lg object-cover"
                          />
                          <h1>{demande.workshop.name}</h1>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <div
                            style={{
                              backgroundColor: `${demande.material.color}33`,
                              color: `${demande.material.color}`,
                            }}
                            className="rounded-full px-4 py-1.5 text-xs font-medium">
                            {demande.material.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <div
                            className={cn(
                              "rounded-full px-4 py-1.5 text-xs font-medium",
                              demande.priority === "NORMAL"
                                ? "text-[#21D954] bg-[#21D95426]"
                                : demande.priority === "URGENT"
                                ? "text-[#BA0000] bg-[#BA000026]"
                                : "text-[#FFD12E] bg-[#FFD12E26]"
                            )}>
                            {demande.priority === "NORMAL"
                              ? "Normal"
                              : demande.priority === "URGENT"
                              ? "Urgent"
                              : "faible"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Popover>
                            <PopoverTrigger
                              onClick={(e) => {
                                e.stopPropagation();
                              }}>
                              <div
                                style={{
                                  backgroundColor: `${demande.stage?.color}33`,
                                  color: `${demande.stage?.color}`,
                                }}
                                className="px-3 py-1.5 rounded-[3.96px] font-medium text-xs">
                                {demande.stage?.name}
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
                                            toast.loading("mise a jour...", {
                                              id: "loading",
                                            });
                                            updateDemandStage({
                                              demandId: demande.id,
                                              stageId: stage.id,
                                              oldStageId: demande.stageId,
                                            })
                                              .then(() => {
                                                refetch();
                                                toast.success("Success !");
                                              })
                                              .catch(() =>
                                                toast.error("Erreur .")
                                              )
                                              .finally(() =>
                                                toast.dismiss("loading")
                                              );
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
                                      onChange={(e) =>
                                        setNewDemandStageInput(e.target.value)
                                      }
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
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={`https://${
                                process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME
                              }/
                                      
                                      ${
                                        //@ts-ignore
                                        demande?.user?.image?.id
                                      }`}
                            />
                            <AvatarFallback className="text-xs text-white bg-brand">
                              {demande.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-[#95A1B1]">
                            {format(demande.createdAt || new Date(), "d MMM", {
                              locale: fr,
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#95A1B1] text-center">
                        {demande.demandId}
                      </TableCell>
                    </TableRow>
                  </SheetTrigger>
                  <SheetContent>
                    <DemandDetails demand={demande} stages={stages} />
                  </SheetContent>
                </Sheet>
              )
            )
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-5 w-full mt-3 p-5">
        <Button
          className={cn(
            "rounded-md",
            !!currentDemands?.pages.length && currentDemands?.pages.length <= 1
              ? "text-black"
              : "text-white"
          )}
          variant={
            !!currentDemands?.pages.length && currentDemands?.pages.length <= 1
              ? "ghost"
              : "brand"
          }
          disabled={
            !!currentDemands?.pages.length && currentDemands?.pages.length <= 1
          }
          onClick={() => {
            setIsFetchingPreviousPage(true);
            fetchPreviousPage();
            currentDemands?.pages.length &&
              currentDemands?.pages.length > 1 &&
              currentDemands?.pages.pop();
            setIsFetchingPreviousPage(false);
          }}>
          Prev
        </Button>
        <Button
          variant={hasNextPage ? "brand" : "ghost"}
          className={cn(
            "rounded-md",
            hasNextPage ? "text-white" : "text-black"
          )}
          disabled={!hasNextPage}
          onClick={() => fetchNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
DemandesTable.Skeleton = function SkeletonDemandesTable() {
  return (
    <TableRow className="text-[#757575]">
      <TableCell className="text-black font-semibold flex items-center space-x-2 p-5">
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell className="font-medium text-center">
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="w-28 h-5" />
      </TableCell>
    </TableRow>
  );
};
