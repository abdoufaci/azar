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
import {
  OrderWithRelationsWithHistory,
  ProductionInTable,
  UserWithWorkshop,
} from "@/types/types";
import { OrderStage } from "@prisma/client";
import { format } from "date-fns";
import {
  ChevronLeft,
  CircleFadingPlus,
  Minus,
  PenLine,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  order: OrderWithRelationsWithHistory;
  orderStages: OrderStage[];
  employees: UserWithWorkshop[];
}

function SubProductionDetails({ order, employees, orderStages }: Props) {
  const [newOrderStageInput, setNewOrderStageInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [isAddingOrderStagePending, startAddingOrderStage] = useTransition();
  const [isPending, startTransition] = useTransition();

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
  return (
    <div className="space-y-10">
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
                      : "Tapisier"}
                  </h5>
                  <h5 className="text-[#056BE4]">{action.employee?.name}</h5>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubProductionDetails;
