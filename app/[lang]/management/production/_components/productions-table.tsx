"use client";

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
import Image from "next/image";
import { useMemo } from "react";

const productions = [
  {
    id: "654B417",
    atelier: "Ouled Belhadj",
    atelierColor: "blue",
    production: "MAURICE",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    statut: "Commande",
    client: "AZAM HOME",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654B417",
    atelier: "Sehawla",
    atelierColor: "green",
    production: "MAURICE",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    statut: "Commande",
    client: "AZAM HOME",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654B417",
    atelier: "Ouled Belhadj",
    atelierColor: "blue",
    production: "MAURICE",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    statut: "Commande",
    client: "AZAM HOME",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654B417",
    atelier: "Ouled Belhadj",
    atelierColor: "blue",
    production: "MAURICE",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    statut: "Commande",
    client: "AZAM HOME",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654B417",
    atelier: "Sehawla",
    atelierColor: "green",
    production: "MAURICE",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    statut: "Commande",
    client: "AZAM HOME",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654B417",
    atelier: "Ouled Belhadj",
    atelierColor: "blue",
    production: "MAURICE",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    statut: "Commande",
    client: "AZAM HOME",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654B417",
    atelier: "Ouled Belhadj",
    atelierColor: "blue",
    production: "MAURICE",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    statut: "Commande",
    client: "AZAM HOME",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654B417",
    atelier: "Ouled Belhadj",
    atelierColor: "blue",
    production: "MAURICE",
    type: "3+2+1",
    tissus: "SOLOMON 02",
    statut: "Commande",
    client: "AZAM HOME",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
];

interface ProductionsTableProps {
  filters?: {
    atelier?: string | null;
    production?: string | null;
    type?: string | null;
    tissus?: string | null;
    statut?: string | null;
    client?: string | null;
    search?: string | null;
  };
}

function getAtelierColor(color: string) {
  switch (color) {
    case "blue":
      return "bg-blue-500";
    case "green":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

export function ProductionsTable() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-[#64748B] font-normal p-5">
              Atelier
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Production
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Type
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Tissus
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Statut
            </TableHead>
            <TableHead className="text-[#64748B] font-normal text-center">
              Client
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
          {productions.map((demande, index) => (
            <TableRow key={index} className="border-border hover:bg-muted/30">
              <TableCell className="p-5">
                <div className="flex items-start justify-start gap-1.5">
                  <Image
                    alt="workshop"
                    src={"/workshop2.svg"}
                    width={25}
                    height={25}
                    className="rounded-lg object-cover"
                  />
                  <h1>{demande.atelier}</h1>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Badge variant={"blue"} className="rounded-full px-4 py-2">
                    {demande.production}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {demande.type}
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {demande.tissus}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Badge variant={"purple"} className="px-4 py-2">
                    {demande.statut}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <div className="rounded-full flex items-center justify-center px-5 py-1.5 w-fit border border-[#95A1B14F] text-[#182233]">
                    {demande.client}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={demande.creation.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-[#95A1B1]">
                    {demande.creation.time}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-[#95A1B1] text-center">
                {demande.id}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
