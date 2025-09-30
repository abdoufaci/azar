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

const demandes = [
  {
    id: "654677",
    demande: "Bois de quelque chose",
    atelier: "Ouled Belhadj",
    type: "Bois",
    priorite: "Normal",
    statut: "En Cours",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654677",
    demande: "Bois de quelque chose",
    atelier: "Ouled Belhadj",
    type: "Tissu",
    priorite: "Urgent",
    statut: "En Cours",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654677",
    demande: "Bois de quelque chose",
    atelier: "Ouled Belhadj",
    type: "Tissu",
    priorite: "Faible",
    statut: "En Cours",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654677",
    demande: "Bois de quelque chose",
    atelier: "Ouled Belhadj",
    type: "Bois",
    priorite: "Urgent",
    statut: "En Cours",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654677",
    demande: "Bois de quelque chose",
    atelier: "Ouled Belhadj",
    type: "Tissu",
    priorite: "Normal",
    statut: "En Cours",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654677",
    demande: "Bois de quelque chose",
    atelier: "Ouled Belhadj",
    type: "Tissu",
    priorite: "Urgent",
    statut: "En Cours",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654677",
    demande: "Bois de quelque chose",
    atelier: "Ouled Belhadj",
    type: "Bois",
    priorite: "Normal",
    statut: "En Cours",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
  {
    id: "654677",
    demande: "Bois de quelque chose",
    atelier: "Ouled Belhadj",
    type: "Tissu",
    priorite: "Faible",
    statut: "En Cours",
    creation: {
      avatar: "/man.png",
      time: "12 fevr",
    },
  },
];

function getPriorityVariant(priorite: string) {
  switch (priorite) {
    case "Urgent":
      return "bg-[#BA000026] text-[#BA0000] hover:bg-[#BA000026]";
    case "Normal":
      return "bg-[#21D95426] text-[#21D954] hover:bg-[#21D95426]";
    case "Faible":
      return "bg-[#FFD12E26] text-[#FFD12E] hover:bg-[#FFD12E26]";
    default:
      return "bg-secondary text-secondary-foreground hover:bg-secondary";
  }
}

function getTypeVariant(type: string) {
  switch (type) {
    case "Bois":
      return "bg-[#DEEDFF] text-[#056BE4] hover:bg-[#DEEDFF]";
    case "Tissu":
      return "bg-[#F3732324] text-[#F37323] hover:bg-[#F3732324]";
    default:
      return "bg-secondary text-secondary-foreground hover:bg-secondary";
  }
}

export function DemandesTable() {
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
          {demandes.map((demande, index) => (
            <TableRow
              key={index}
              className="border-border hover:bg-muted/30 cursor-pointer">
              <TableCell className="text-[#576070] p-5">
                {demande.demande}
              </TableCell>
              <TableCell className="text-[#06191D] font-medium p-5 text-center">
                <div className="flex items-start justify-center gap-1.5">
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
                  <Badge
                    //@ts-ignore
                    variant={badgeVariant[demande.type]}
                    className="rounded-full px-10 py-1">
                    {demande.type}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Badge
                    //@ts-ignore
                    variant={badgeVariant[demande.priorite]}
                    className="rounded-full px-10 py-1">
                    {demande.priorite}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Badge variant={"blue"} className="px-10 py-1">
                    {demande.statut}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center items-center gap-2">
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
