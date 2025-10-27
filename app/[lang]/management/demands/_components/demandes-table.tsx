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

interface Props {
  currentPage: number;
  totalDemands: number;
  demandsPerPage: number;
  searchParams: Record<string, string | string[] | undefined>;
  demands: DemandInTable[];
  stages: DemandStage[];
  url?: string;
}

export function DemandesTable({
  currentPage,
  demandsPerPage,
  searchParams,
  totalDemands,
  demands,
  stages,
  url = "/management/demands",
}: Props) {
  const [newDemandStageInput, setNewDemandStageInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [isAddingDemandStagePending, startAddingDemandStage] = useTransition();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const totalPages = Math.ceil(totalDemands / demandsPerPage);

  const { page, ...rest } = searchParams;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const path = qs.stringifyUrl(
        {
          url,
          query: {
            page: currentPage + 1,
            ...rest,
          },
        },
        { skipNull: true }
      );
      router.push(path);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const path = qs.stringifyUrl(
        {
          url,
          query: {
            page: currentPage === 2 ? null : currentPage - 1,
            ...rest,
          },
        },
        { skipNull: true }
      );
      router.push(path);
    }
  };

  const handleAddDemandStage = () => {
    startAddingDemandStage(() => {
      addDemandStage(newDemandStageInput)
        .then(() => {
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
          {demands.map((demande, index) => (
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
                                            toast.success("Success !");
                                          })
                                          .catch(() => toast.error("Erreur ."))
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
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col md:!flex-row md:!items-center justify-between gap-4 p-5">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * demandsPerPage + 1} to{" "}
          {Math.min(currentPage * demandsPerPage, totalDemands)} of{" "}
          {totalDemands} entries
        </div>
        <div className="flex flex-wrap items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="border-[#B9BEC7] hover:bg-gray-800">
            Previous
          </Button>
          {Array.from(Array(totalPages).keys()).map((_, idx) => {
            const path = qs.stringifyUrl(
              {
                url,
                query: {
                  page: idx === 0 ? null : idx + 1,
                  ...rest,
                },
              },
              { skipNull: true }
            );

            return (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className={cn(
                  "",
                  idx + 1 === currentPage
                    ? "bg-brand border-brand hover:bg-brand/90 text-white hover:text-white"
                    : "border-[#B9BEC7] hover:bg-gray-800"
                )}
                asChild>
                <Link href={path}>{idx + 1}</Link>
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="border-[#B9BEC7] hover:bg-gray-800">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
