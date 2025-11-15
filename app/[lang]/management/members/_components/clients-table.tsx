"use client";

import { Button } from "@/components/ui/button";
import { Pencil, PenLine, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserInTable } from "@/types/types";
import { useModal } from "@/hooks/use-modal-store";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  clients: UserInTable[];
  onEdit: (user: UserInTable) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

export function ClientsTable({ clients, onEdit, onDelete, isPending }: Props) {
  const { onOpen } = useModal();

  return (
    <div className="w-full">
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#64748B] font-normal text-center p-5">
                Client
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                Psuedo
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                Numero
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                Wilaya
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                Address
              </TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <>
                <ClientsTable.Skeleton />
                <ClientsTable.Skeleton />
                <ClientsTable.Skeleton />
                <ClientsTable.Skeleton />
                <ClientsTable.Skeleton />
                <ClientsTable.Skeleton />
                <ClientsTable.Skeleton />
                <ClientsTable.Skeleton />
              </>
            ) : (
              clients.map((client) => (
                <TableRow
                  key={client.id}
                  className="hover:bg-muted/50 text-[#95A1B1]">
                  <TableCell className="text-[#8E8E8E] flex items-center justify-center text-center">
                    <div className="rounded-full px-8 py-2 w-fit border border-[#95A1B14F] text-[#95A1B1] font-medium">
                      {client.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#8E8E8E] text-center">
                    {client.username}
                  </TableCell>
                  <TableCell className="text-[#8E8E8E] text-center">
                    {client.phone}
                  </TableCell>
                  <TableCell className="text-[#8E8E8E] text-center">
                    {client.wilaya}
                  </TableCell>
                  <TableCell className="text-[#8E8E8E] text-center">
                    {client.address}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(client)}
                        className="h-8 w-8 p-0 text-[#8E8E8E] hover:text-[#8E8E8E]">
                        <PenLine className="h-4 w-4" />
                        <span className="sr-only">Edit client</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();

                          onOpen("deleteUser", {
                            user: client,
                            onDeleteUser: () => onDelete(client.id),
                          });
                        }}
                        className="h-8 w-8 p-0 text-[#CE2A2A] hover:text-[#CE2A2A]">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete client</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

ClientsTable.Skeleton = function SkeletonClientsTable() {
  return (
    <TableRow className="text-[#757575]">
      <TableCell className="text-black font-semibold flex justify-center items-center space-x-2 p-5">
        <Skeleton className="w-28 h-5" />
      </TableCell>
      <TableCell className="font-medium  text-center">
        <div className="flex items-center justify-center">
          <Skeleton className="w-28 h-5" />
        </div>
      </TableCell>
      <TableCell className="">
        <div className="flex items-center justify-center">
          <Skeleton className="w-28 h-5" />
        </div>
      </TableCell>
      <TableCell className="">
        <div className="flex items-center justify-center">
          <Skeleton className="w-28 h-5" />
        </div>
      </TableCell>
      <TableCell className="">
        <div className="flex items-center justify-center">
          <Skeleton className="w-28 h-5" />
        </div>
      </TableCell>
      <TableCell className="">
        <div className="flex items-center justify-center">
          <Skeleton className="w-10 h-5" />
        </div>
      </TableCell>
    </TableRow>
  );
};
