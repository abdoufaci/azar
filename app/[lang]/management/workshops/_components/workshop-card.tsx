import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Demand, Order, OrderStage, WorkShop } from "@prisma/client";

interface Props {
  workshop: WorkShop & {
    demands: Demand[];
    orders: (Order & {
      orderStage: OrderStage | null;
    })[];
  };
}

function WorkshopCard({ workshop }: Props) {
  const commandOrders = workshop.orders.filter(
    (order) => order.orderStage?.name === "Commande"
  );
  const enCourOrders = workshop.orders.filter(
    (order) => order.orderStage?.name === "En Cours.."
  );
  return (
    <Card className="w-full max-w-md bg-white shadow-sm border-0 rounded-2xl overflow-hidden space-y-3">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Image
              alt="workshop"
              src={workshop.image}
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
            <CardTitle className="text-lg font-medium text-[#232626]">
              {workshop.name}
            </CardTitle>
            {!!workshop.demands.find(
              (demand) => demand.priority === "URGENT"
            ) && (
              <Badge
                variant="destructive"
                className="bg-[#BA0000]/10 text-[#BA0000] hover:bg-[#BA0000]/10 text-xs px-5 py-1 rounded-full font-medium">
                URGENT DEMAND
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-[#182233] ">Production Overview</p>
        <div className="flex gap-10 items-center">
          <div className="text-center">
            <div className="text-3xl font-medium text-purple-600 mb-1">
              {commandOrders.length < 10 && "0"}
              {commandOrders.length}
            </div>
            <div className="text-xs text-gray-500">Command</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-medium text-blue-600 mb-1">
              {enCourOrders.length < 10 && "0"}
              {enCourOrders.length}
            </div>
            <div className="text-xs text-gray-500">En Cours</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-medium text-orange-500 mb-1">
              {workshop.demands.length < 10 && "0"}
              {workshop.demands.length}
            </div>
            <div className="text-xs text-gray-500">Demand</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WorkshopCard;
