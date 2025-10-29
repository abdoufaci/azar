import { addOrderStage } from "@/actions/mutations/order/add-order-stage";
import { removeOrderWorker } from "@/actions/mutations/order/remove-order-worker";
import { updateOrderStage } from "@/actions/mutations/order/update-order-stage";
import { updateOrderWorkers } from "@/actions/mutations/order/update-order-workers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ProductionInTable, UserWithWorkshop } from "@/types/types";
import { OrderColumn, OrderColumnStatus, OrderStage } from "@prisma/client";
import { format } from "date-fns";
import {
  Check,
  ChevronLeft,
  CircleFadingPlus,
  Minus,
  PenLine,
  Plus,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import SubProductionDetails from "./sub-production-details";
import { addColumnStatus } from "@/actions/mutations/order/add-column-status";
import { truncate } from "@/lib/truncate";
import { manageCell } from "@/actions/mutations/order/manage-cell";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  order: ProductionInTable;
  orderStages: OrderStage[];
  onClick: (production: ProductionInTable) => void;
  employees: UserWithWorkshop[];
  onSubOrderClick: () => void;
  columns: (OrderColumn & {
    statuses: OrderColumnStatus[];
  })[];
}

function ProductionDetails({
  onClick,
  orderStages,
  order,
  employees,
  onSubOrderClick,
  columns,
}: Props) {
  const [newOrderStageInput, setNewOrderStageInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [isAddingOrderStagePending, startAddingOrderStage] = useTransition();
  const [isPending, startTransition] = useTransition();
  const [cellTextToEdit, setCellTextToEdit] = useState<number | null>(null);
  const [cellText, setCellText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddOrderStage = () => {
    startAddingOrderStage(() => {
      addOrderStage(newOrderStageInput)
        .then(() => {
          setNewOrderStageInput("");
          setShowAdd(false);
          toast.success("created !");
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  const handleAddOrderColumnStatus = (columnId: string) => {
    startAddingOrderStage(() => {
      addColumnStatus({
        columnId,
        name: newOrderStageInput,
      })
        .then(() => {
          setNewOrderStageInput("");
          setShowAdd(false);
          toast.success("created !");
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  const cutters = employees.filter(
    (user) =>
      user.workShopId === order.workShopId && user.employeeRole === "CUTTER"
  );

  const tailors = employees.filter(
    (user) =>
      user.workShopId === order.workShopId && user.employeeRole === "TAILOR"
  );

  const tapisiers = employees.filter(
    (user) =>
      user.workShopId === order.workShopId && user.employeeRole === "TAPISIER"
  );

  const mancheurs = employees.filter(
    (user) =>
      user.workShopId === order.workShopId && user.employeeRole === "MANCHEUR"
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-5">
        <SheetClose>
          <div className="flex items-center gap-1">
            <ChevronLeft className="h-5 w-5 text-[#576070]" />
            <div className="flex items-center justify-start gap-1.5">
              <Image
                alt="workshop"
                src={order.workShop?.image || "/workshop2.svg"}
                width={25}
                height={25}
                className="rounded-lg object-cover mt-1"
              />
              <h1 className="text-[#182233]">{order.workShop?.name}</h1>
            </div>
          </div>
        </SheetClose>
        <Button variant={"ghost"} onClick={() => onClick(order)}>
          <PenLine className="h-5 w-5" />
        </Button>
      </div>
      <Image alt="barCode" src={"/bar-code.png"} height={200} width={250} />
      <div className="space-y-5">
        <div className="space-y-2">
          <h3 className="text-[#95A1B1] font-medium text-xs">
            {order.orderId}
          </h3>
          <div className="flex items-center gap-4">
            <div
              style={{
                backgroundColor: `${order.variant.color}33`,
                color: `${order.variant.color}`,
              }}
              className="rounded-full px-4 py-1.5 text-xs font-medium">
              {order.variant.name}
            </div>
            <h3 className="text-[#182233] font-medium">{order.subType.name}</h3>
            {order.tissu && (
              <h5 className="text-[#95A1B1] font-medium text-sm">
                {order.tissu?.name}
              </h5>
            )}
          </div>
          <p className="text-[#576070] text-sm">{order.note}</p>
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
                  order.user?.image?.id
                }`}
              />
              <AvatarFallback className="bg-brand text-white flex items-center justify-center">
                {order.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-sm font-medium text-[#182233]">
              {order.user?.name}
            </h1>
            <h3 className="text-xs font-medium text-[#95A1B1]">
              {format(order?.acceptedAt || new Date(), "HH:mm dd/MM/yyyy")}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-[#576070] font-medium text-sm">Decoup</h1>
          {!!order.cutter ? (
            <div className="rounded-full p-1 border border-[#EBECF2] flex items-center gap-1.5 pr-2">
              <Avatar className="w-6 h-6 flex items-center justify-center">
                <AvatarImage
                  className="object-cover"
                  src={`https://${process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME}/${
                    //@ts-ignore
                    order.cutter?.image?.id
                  }`}
                />
                <AvatarFallback className="bg-brand text-white flex items-center justify-center">
                  {order.cutter?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-sm font-medium text-[#182233]">
                {order.cutter?.name}
              </h1>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full bg-[#ba0000]/10 hover:bg-[#ba0000]/10"
                onClick={() => {
                  if (!isPending) {
                    startTransition(() => {
                      toast.loading("mise a jour...", { id: "loading" });
                      removeOrderWorker({
                        orderId: order.id,
                        type: "CUTTER",
                        userId: order.cutterId || "",
                      })
                        .then(() => toast.success("Success !"))
                        .catch(() => toast.error("Erreur ."))
                        .finally(() => toast.dismiss("loading"));
                    });
                  }
                }}>
                <Minus className="h-3 w-3 text-[#ba0000]" />
              </Button>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <CircleFadingPlus
                  color="#1E78FF"
                  strokeWidth={1.25}
                  style={{
                    backgroundColor: "#E7F1F8",
                  }}
                  className="rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 w-fit">
                {cutters.map((employee, idx) => (
                  <div
                    key={employee.id}
                    onClick={() => {
                      if (!isPending) {
                        startTransition(() => {
                          toast.loading("mise a jour...", {
                            id: "loading",
                          });
                          updateOrderWorkers({
                            orderId: order.id,
                            userId: employee.id,
                            type: "CUTTER",
                            currentRef: order.orderId,
                          })
                            .then(() => toast.success("Success !"))
                            .catch(() => toast.error("Erreur ."))
                            .finally(() => toast.dismiss("loading"));
                        });
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer",
                      idx !== cutters.length - 1 && "border-b"
                    )}>
                    <Avatar className="w-6 h-6 flex items-center justify-center">
                      <AvatarImage
                        className="object-cover"
                        src={`https://${
                          process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME
                        }/${
                          //@ts-ignore
                          employee?.image?.id
                        }`}
                      />
                      <AvatarFallback className="bg-brand text-white flex items-center justify-center">
                        {employee?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-sm font-medium text-[#182233]">
                      {employee?.name}
                    </h1>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-[#576070] font-medium text-sm">Couteur</h1>
          {!!order.tailor ? (
            <div className="rounded-full p-1 border border-[#EBECF2] flex items-center gap-1.5 pr-2">
              <Avatar className="w-6 h-6 flex items-center justify-center">
                <AvatarImage
                  className="object-cover"
                  src={`https://${process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME}/${
                    //@ts-ignore
                    order.tailor?.image?.id
                  }`}
                />
                <AvatarFallback className="bg-brand text-white flex items-center justify-center">
                  {order.tailor?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-sm font-medium text-[#182233]">
                {order.tailor?.name}
              </h1>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full bg-[#ba0000]/10 hover:bg-[#ba0000]/10"
                onClick={() => {
                  if (!isPending) {
                    startTransition(() => {
                      toast.loading("mise a jour...", { id: "loading" });
                      removeOrderWorker({
                        orderId: order.id,
                        type: "TAILOR",
                        userId: order.tailorId || "",
                      })
                        .then(() => toast.success("Success !"))
                        .catch(() => toast.error("Erreur ."))
                        .finally(() => toast.dismiss("loading"));
                    });
                  }
                }}>
                <Minus className="h-3 w-3 text-[#ba0000]" />
              </Button>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <CircleFadingPlus
                  color="#1E78FF"
                  strokeWidth={1.25}
                  style={{
                    backgroundColor: "#E7F1F8",
                  }}
                  className="rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 w-fit">
                {tailors.map((employee, idx) => (
                  <div
                    key={employee.id}
                    onClick={() => {
                      if (!isPending) {
                        startTransition(() => {
                          toast.loading("mise a jour...", {
                            id: "loading",
                          });
                          updateOrderWorkers({
                            orderId: order.id,
                            userId: employee.id,
                            type: "TAILOR",
                          })
                            .then(() => toast.success("Success !"))
                            .catch(() => toast.error("Erreur ."))
                            .finally(() => toast.dismiss("loading"));
                        });
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer",
                      idx !== tailors.length - 1 && "border-b"
                    )}>
                    <Avatar className="w-6 h-6 flex items-center justify-center">
                      <AvatarImage
                        className="object-cover"
                        src={`https://${
                          process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME
                        }/${
                          //@ts-ignore
                          employee?.image?.id
                        }`}
                      />
                      <AvatarFallback className="bg-brand text-white flex items-center justify-center">
                        {employee?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-sm font-medium text-[#182233]">
                      {employee?.name}
                    </h1>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-[#576070] font-medium text-sm">Tapisier</h1>
          {!!order.tapisier ? (
            <div className="rounded-full p-1 border border-[#EBECF2] flex items-center gap-1.5 pr-2">
              <Avatar className="w-6 h-6 flex items-center justify-center">
                <AvatarImage
                  className="object-cover"
                  src={`https://${process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME}/${
                    //@ts-ignore
                    order.tapisier?.image?.id
                  }`}
                />
                <AvatarFallback className="bg-brand text-white flex items-center justify-center">
                  {order.tapisier?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-sm font-medium text-[#182233]">
                {order.tapisier?.name}
              </h1>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full bg-[#ba0000]/10 hover:bg-[#ba0000]/10"
                onClick={() => {
                  if (!isPending) {
                    startTransition(() => {
                      toast.loading("mise a jour...", { id: "loading" });
                      removeOrderWorker({
                        orderId: order.id,
                        type: "TAPISIER",
                        userId: order.tapisierId || "",
                      })
                        .then(() => toast.success("Success !"))
                        .catch(() => toast.error("Erreur ."))
                        .finally(() => toast.dismiss("loading"));
                    });
                  }
                }}>
                <Minus className="h-3 w-3 text-[#ba0000]" />
              </Button>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <CircleFadingPlus
                  color="#1E78FF"
                  strokeWidth={1.25}
                  style={{
                    backgroundColor: "#E7F1F8",
                  }}
                  className="rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 w-fit">
                {tapisiers.map((employee, idx) => (
                  <div
                    key={employee.id}
                    onClick={() => {
                      if (!isPending) {
                        startTransition(() => {
                          toast.loading("mise a jour...", {
                            id: "loading",
                          });
                          updateOrderWorkers({
                            orderId: order.id,
                            userId: employee.id,
                            type: "TAPISIER",
                          })
                            .then(() => toast.success("Success !"))
                            .catch(() => toast.error("Erreur ."))
                            .finally(() => toast.dismiss("loading"));
                        });
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer",
                      idx !== tapisiers.length - 1 && "border-b"
                    )}>
                    <Avatar className="w-6 h-6 flex items-center justify-center">
                      <AvatarImage
                        className="object-cover"
                        src={`https://${
                          process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME
                        }/${
                          //@ts-ignore
                          employee?.image?.id
                        }`}
                      />
                      <AvatarFallback className="bg-brand text-white flex items-center justify-center">
                        {employee?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-sm font-medium text-[#182233]">
                      {employee?.name}
                    </h1>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-[#576070] font-medium text-sm">Mancheur</h1>
          {!!order.mancheur ? (
            <div className="rounded-full p-1 border border-[#EBECF2] flex items-center gap-1.5 pr-2">
              <Avatar className="w-6 h-6 flex items-center justify-center">
                <AvatarImage
                  className="object-cover"
                  src={`https://${process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME}/${
                    //@ts-ignore
                    order.mancheur?.image?.id
                  }`}
                />
                <AvatarFallback className="bg-brand text-white flex items-center justify-center">
                  {order.mancheur?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-sm font-medium text-[#182233]">
                {order.mancheur?.name}
              </h1>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full bg-[#ba0000]/10 hover:bg-[#ba0000]/10"
                onClick={() => {
                  if (!isPending) {
                    startTransition(() => {
                      toast.loading("mise a jour...", { id: "loading" });
                      removeOrderWorker({
                        orderId: order.id,
                        type: "MANCHEUR",
                        userId: order.mancheurId || "",
                      })
                        .then(() => toast.success("Success !"))
                        .catch(() => toast.error("Erreur ."))
                        .finally(() => toast.dismiss("loading"));
                    });
                  }
                }}>
                <Minus className="h-3 w-3 text-[#ba0000]" />
              </Button>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <CircleFadingPlus
                  color="#1E78FF"
                  strokeWidth={1.25}
                  style={{
                    backgroundColor: "#E7F1F8",
                  }}
                  className="rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 w-fit">
                {mancheurs.map((employee, idx) => (
                  <div
                    key={employee.id}
                    onClick={() => {
                      if (!isPending) {
                        startTransition(() => {
                          toast.loading("mise a jour...", {
                            id: "loading",
                          });
                          updateOrderWorkers({
                            orderId: order.id,
                            userId: employee.id,
                            type: "MANCHEUR",
                          })
                            .then(() => toast.success("Success !"))
                            .catch(() => toast.error("Erreur ."))
                            .finally(() => toast.dismiss("loading"));
                        });
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer",
                      idx !== mancheurs.length - 1 && "border-b"
                    )}>
                    <Avatar className="w-6 h-6 flex items-center justify-center">
                      <AvatarImage
                        className="object-cover"
                        src={`https://${
                          process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME
                        }/${
                          //@ts-ignore
                          employee?.image?.id
                        }`}
                      />
                      <AvatarFallback className="bg-brand text-white flex items-center justify-center">
                        {employee?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-sm font-medium text-[#182233]">
                      {employee?.name}
                    </h1>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          )}
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
                  backgroundColor: `${order.orderStage?.color}21`,
                }}
                className="px-3 py-1.5 rounded-[3.96px] font-medium text-xs flex items-center gap-3 text-[#182233]">
                <div
                  style={{
                    backgroundColor: `${order.orderStage?.color}`,
                  }}
                  className="w-3 h-3 rounded-full"
                />
                <h1>{order.orderStage?.name}</h1>
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
                  {orderStages.map((stage) => (
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
                            updateOrderStage({
                              orderId: order.id,
                              orderStageId: stage.id,
                              oldStageId: order.orderStageId || "",
                            })
                              .then(() => {
                                toast.success("Success !");
                              })
                              .catch(() => toast.error("Erreur ."))
                              .finally(() => toast.dismiss("loading"));
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
                      disabled={isAddingOrderStagePending}
                      type="text"
                      placeholder="ex: en cours.."
                      value={newOrderStageInput}
                      onChange={(e) => setNewOrderStageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent form submission on Enter for this input
                          handleAddOrderStage();
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
        <div className="flex items-center gap-3">
          <h1 className="text-[#576070] font-medium text-sm">Prix</h1>
          <h1 className="font-medium text-[#232626]">{order.price} DA</h1>
        </div>
        {columns.map((column, idx) => {
          const cell = order.extraCells.find(
            (cell) => cell.orderColumnId === column.id
          );
          return (
            <div key={column.id} className="flex items-center gap-3">
              <h1 className="text-[#576070] font-medium text-sm">
                {column.name}
              </h1>
              {column.type === "PERSON" && (
                <>
                  {!!cell?.person ? (
                    <div className="rounded-full p-1 border border-[#EBECF2] flex items-center gap-1.5 pr-2">
                      <Avatar className="w-6 h-6 flex items-center justify-center">
                        <AvatarImage
                          className="object-cover"
                          src={`https://${
                            process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME
                          }/${
                            //@ts-ignore
                            cell?.person?.image?.id
                          }`}
                        />
                        <AvatarFallback className="bg-brand text-white flex items-center justify-center">
                          {cell?.person?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <h1 className="text-sm font-medium text-[#182233]">
                        {cell?.person?.name}
                      </h1>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-[#ba0000]/10 hover:bg-[#ba0000]/10"
                        onClick={() => {
                          if (!isPending) {
                            startTransition(() => {
                              toast.loading("mise a jour...", {
                                id: "loading",
                              });
                              manageCell({
                                orderId: order.id,
                                columnId: column.id,
                                cellId: cell?.id,
                                personId: null,
                              })
                                .then(() => toast.success("Success !"))
                                .catch(() => toast.error("Erreur ."))
                                .finally(() => toast.dismiss("loading"));
                            });
                          }
                        }}>
                        <Minus className="h-3 w-3 text-[#ba0000]" />
                      </Button>
                    </div>
                  ) : (
                    <Popover>
                      <PopoverTrigger>
                        <CircleFadingPlus
                          color="#1E78FF"
                          strokeWidth={1.25}
                          style={{
                            backgroundColor: "#E7F1F8",
                          }}
                          className="rounded-full cursor-pointer"
                        />
                      </PopoverTrigger>
                      <PopoverContent className="overflow-hidden !min-w-[350px]">
                        <div className="space-y-6 w-full">
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#576070]" />
                            <Input
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              type="text"
                              placeholder="Search for members..."
                              className="h-14 rounded-[5.46px] border border-[#E7F1F8] bg-[#ffffff] pl-12 text-base text-[#182233] shadow-sm placeholder:text-[#576070]"
                            />
                          </div>

                          {/* Members List */}
                          <div className="space-y-3">
                            {employees
                              .filter(
                                (item) => item.workShopId === order.workShopId
                              )
                              ?.filter((item) =>
                                item.name
                                  .toLowerCase()
                                  .trim()
                                  .includes(searchTerm.trim().toLowerCase())
                              )
                              .map((member) => {
                                const isSelected = member.id === cell?.personId;
                                return (
                                  <div
                                    key={member.id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      startTransition(() => {
                                        toast.loading("mise a jour...", {
                                          id: "loading",
                                        });
                                        manageCell({
                                          orderId: order.id,
                                          columnId: column.id,
                                          cellId: cell?.id,
                                          personId: isSelected
                                            ? null
                                            : member.id,
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
                                    className="flex cursor-pointer w-full items-center justify-between rounded-[5.46px] bg-[#f3f6f8] p-4 py-2 transition-colors hover:bg-[#ebecf2]">
                                    <div className="flex items-center gap-4">
                                      <Avatar className="h-12 w-12">
                                        <AvatarImage
                                          src={""}
                                          alt={member.name}
                                          className="object-cover"
                                        />
                                        <AvatarFallback className="bg-brand text-white">
                                          {member.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="text-left">
                                        <div className="text-lg font-semibold text-[#182233]">
                                          {member.name}
                                        </div>
                                        <div className="text-sm text-[#576070]">
                                          {member.employeeRole === "CUTTER"
                                            ? "Decoupeur"
                                            : member.employeeRole === "TAILOR"
                                            ? "Couteur"
                                            : member.employeeRole === "MANCHEUR"
                                            ? "Mancheur"
                                            : "Tapisier"}
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                        isSelected
                                          ? "bg-[#1e78ff]"
                                          : "border-2 border-[#d9d9d9] bg-[#ffffff]"
                                      }`}>
                                      {isSelected && (
                                        <Check className="h-4 w-4 text-[#ffffff]" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </>
              )}
              {column.type === "STATUS" && (
                <Popover>
                  <PopoverTrigger
                    onClick={(e) => {
                      e.stopPropagation();
                    }}>
                    <div
                      style={{
                        backgroundColor: `${
                          cell?.status?.color || "#1E78FF"
                        }21`,
                      }}
                      className="px-3 py-1.5 rounded-[3.96px] font-medium text-xs flex items-center gap-3 text-[#182233]">
                      <div
                        style={{
                          backgroundColor: `${
                            cell?.status?.color || "#1E78FF"
                          }`,
                        }}
                        className="w-3 h-3 rounded-full"
                      />
                      <h1>{cell?.status?.name || "En Cours.."}</h1>
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
                        {column.statuses.map((status) => (
                          <div
                            key={status.id}
                            className="px-4 pt-3 flex items-center justify-center">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                startTransition(() => {
                                  toast.loading("mise a jour...", {
                                    id: "loading",
                                  });
                                  manageCell({
                                    orderId: order.id,
                                    columnId: column.id,
                                    cellId: cell?.id,
                                    statusId: status.id,
                                  })
                                    .then(() => {
                                      toast.success("Success !");
                                    })
                                    .catch(() => toast.error("Erreur ."))
                                    .finally(() => toast.dismiss("loading"));
                                });
                              }}
                              style={{
                                backgroundColor: `${status?.color}33`,
                                color: `${status?.color}`,
                              }}
                              className="px-3 py-1.5 rounded-[3.96px] font-medium text-xs cursor-pointer w-full max-w-32 flex items-center justify-center">
                              {status?.name}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="px-4 pb-2">
                        {showAdd ? (
                          <Input
                            className="mb-2"
                            disabled={isAddingOrderStagePending}
                            type="text"
                            placeholder="ex: en cours.."
                            value={newOrderStageInput}
                            onChange={(e) =>
                              setNewOrderStageInput(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault(); // Prevent form submission on Enter for this input
                                handleAddOrderColumnStatus(column.id);
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
              )}
              {column.type === "TEXT" && (
                <>
                  {cellTextToEdit === idx ? (
                    <Input
                      className="w-full max-w-28"
                      disabled={isPending}
                      autoFocus
                      value={cellText}
                      onChange={(e) => setCellText(e.target.value)}
                      onBlur={() => {
                        setCellTextToEdit(null);
                        setCellText("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          startTransition(() => {
                            manageCell({
                              columnId: column.id,
                              orderId: order.id,
                              cellId: cell?.id,
                              text: cellText,
                            })
                              .then(() => {
                                toast.success("Success !");
                                setCellTextToEdit(null);
                                setCellText("");
                              })
                              .catch(() => toast.error("Erreur ."));
                          });
                        }
                      }}
                    />
                  ) : (
                    <p
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setCellTextToEdit(idx);
                        setCellText(cell?.text || "");
                      }}>
                      {cell?.text || "-"}
                    </p>
                  )}
                </>
              )}
              {column.type === "DATE" && (
                <Popover>
                  <PopoverTrigger
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    asChild>
                    <div>
                      {cell?.date ? cell?.date.toLocaleDateString() : "-"}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start">
                    <Calendar
                      disabled={isPending}
                      mode="single"
                      selected={cell?.date || new Date()}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        startTransition(() => {
                          toast.loading("mise a jour...", {
                            id: "loading",
                          });
                          manageCell({
                            columnId: column.id,
                            orderId: order.id,
                            date: date || new Date(),
                            cellId: cell?.id,
                          })
                            .then(() => {
                              toast.success("Success !");
                            })
                            .catch(() => toast.error("Erreur ."))
                            .finally(() => toast.dismiss("loading"));
                        });
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          );
        })}
      </div>
      <div className="space-y-5">
        <h1 className="font-medium text-[#06191D]">LOGS</h1>
        <div className="space-y-3">
          {order.history.map((action) => (
            <div
              key={action.id}
              className="flex items-start gap-0.5 font-medium">
              <h1 className="text-[#056BE4]">{action.user?.name} </h1>{" "}
              {action.type === "INFORMATION" && (
                <h5 className="text-[#182233]"> {action.text}</h5>
              )}
              {action.type === "STAGE" && (
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
              )}
              {action.type === "EMPLOYEE" && (
                <>
                  <h5>
                    a {action.text === "remove" ? "retiré" : "ajouté"}{" "}
                    {action.employee?.employeeRole === "CUTTER"
                      ? "Decoupeur"
                      : action.employee?.employeeRole === "TAILOR"
                      ? "Couteur"
                      : action.employee?.employeeRole === "MANCHEUR"
                      ? "Mancheur"
                      : "Tapisier"}
                  </h5>
                  <h5 className="text-[#056BE4]">{action.employee?.name}</h5>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {!order.subOrderId && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <h1 className="text-[#182233] font-semibold text-xl">Sub Order</h1>
            <div
              onClick={onSubOrderClick}
              className={cn(
                "h-4 w-4 rounded-md border  flex items-center justify-center cursor-pointer border-[#5A5A5A]"
              )}>
              <Plus className={cn("h-3 w-3 text-[#5A5A5A]")} />
            </div>
          </div>
          {order.subOrders.map((order) => (
            <SubProductionDetails
              key={order.id}
              order={order}
              employees={employees}
              orderStages={orderStages}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductionDetails;
