"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { badgeVariant } from "@/constants/badge-var";
import { Check, X } from "lucide-react";
import { useState } from "react";

const orders = [
  {
    id: "654B417",
    client: "AZAM HOME",
    salon: "MAURICE",
    salonColor: "blue",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    temp: "17:60\n17/06/2025",
    note: "Random note...",
    status: "pending", // pending, accepted, rejected
  },
  {
    id: "654B417",
    client: "AZAM HOME",
    salon: "FLORENCE",
    salonColor: "green",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    temp: "17:60\n17/06/2025",
    note: "Random note...",
    status: "pending",
  },
  {
    id: "654B417",
    client: "AZAM HOME",
    salon: "MAURICE",
    salonColor: "blue",
    type: "3+2+1",
    tissus: "OLOMON 02",
    temp: "17:60\n17/06/2025",
    note: "Random note...",
    status: "accepted",
  },
  {
    id: "654B417",
    client: "AZAM HOME",
    salon: "MAURICE",
    salonColor: "blue",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    temp: "17:60\n17/06/2025",
    note: "Random note...",
    status: "accepted",
  },
  {
    id: "654B417",
    client: "AZAM HOME",
    salon: "MAURICE",
    salonColor: "blue",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    temp: "17:60\n17/06/2025",
    note: "Random note...",
    status: "accepted",
  },
  {
    id: "654B417",
    client: "AZAM HOME",
    salon: "MAURICE",
    salonColor: "blue",
    type: "3+2+1",
    tissus: "OLOMON 02",
    temp: "17:60\n17/06/2025",
    note: "Random note...",
    status: "accepted",
  },
  {
    id: "654B417",
    client: "AZAM HOME",
    salon: "MAURICE",
    salonColor: "blue",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    temp: "17:60\n17/06/2025",
    note: "Random note...",
    status: "accepted",
  },
  {
    id: "654B417",
    client: "AZAM HOME",
    salon: "MAURICE",
    salonColor: "blue",
    type: "3+2+1",
    tissus: "OLOMON 02",
    temp: "17:60\n17/06/2025",
    note: "Random note...",
    status: "accepted",
  },
];

export function OrdersTable() {
  const [orderStatuses, setOrderStatuses] = useState<Record<number, string>>(
    orders.reduce((acc, order, index) => {
      acc[index] = order.status;
      return acc;
    }, {} as Record<number, string>)
  );

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-[#64748B] font-normal p-5">
              Client
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Salon
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Type
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Tissus
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              ID
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Temp
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Note
            </TableHead>
            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={index} className="border-border hover:bg-muted/30">
              <TableCell className="p-5">
                <div className="flex items-center justify-start">
                  <div className="rounded-full flex items-center justify-center px-5 py-1.5 w-fit border border-[#95A1B14F] text-[#182233]">
                    {order.client}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Badge
                    //@ts-ignore
                    variant={badgeVariant[order.salon]}
                    className="rounded-full px-4 py-2">
                    {order.salon}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {order.type}
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {order.tissus}
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {order.id}
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center text-sm whitespace-pre-line">
                {order.temp}
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {order.note}
              </TableCell>
              <TableCell>
                {orderStatuses[index] === "accepted" ? (
                  <Badge variant={"green"} className="px-3 py-2">
                    Accepted
                  </Badge>
                ) : orderStatuses[index] === "rejected" ? (
                  <Badge variant={"red"} className="px-3 py-2">
                    Rejected
                  </Badge>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full p-0 bg-[#21D954]/20 hover:bg-[#21D954]/30 text-[#21D954] hover:text-[#21D954]"
                      onClick={() => {}}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full p-0 bg-[#BA0000]/20 hover:bg-[#BA0000]/30 text-[#BA0000] hover:text-[#BA0000]"
                      onClick={() => {}}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
