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
import Image from "next/image";
import { UserInTable } from "@/types/types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EmployeeDetails from "./employee-details";
import { useModal } from "@/hooks/use-modal-store";
import { Skeleton } from "@/components/ui/skeleton";

interface Employee {
  id: number;
  client: string;
  atelier: string;
  email: string;
  psuedo: string;
  numero: string;
}

interface Props {
  employees: UserInTable[];
  onEdit: (user: UserInTable) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

export function EmployeesTable({
  employees,
  onEdit,
  onDelete,
  isPending,
}: Props) {
  const { onOpen } = useModal();

  return (
    <div className="w-full">
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#64748B] font-normal text-center p-5">
                Employé
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                Atelier
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                Role
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                Psuedo
              </TableHead>
              <TableHead className="text-[#64748B] font-normal text-center">
                Numero
              </TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <>
                <EmployeesTable.Skeleton />
                <EmployeesTable.Skeleton />
                <EmployeesTable.Skeleton />
                <EmployeesTable.Skeleton />
                <EmployeesTable.Skeleton />
                <EmployeesTable.Skeleton />
                <EmployeesTable.Skeleton />
                <EmployeesTable.Skeleton />
              </>
            ) : (
              employees.map((employee) => (
                <Sheet key={employee.id}>
                  <SheetTrigger asChild>
                    <TableRow
                      key={employee.id}
                      className="hover:bg-muted/50 text-[#95A1B1] cursor-pointer">
                      <TableCell className="text-[#8E8E8E] flex items-center justify-center">
                        <div className="rounded-full px-8 py-2 w-fit border border-[#95A1B14F] text-[#95A1B1] font-medium">
                          {employee.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-[#06191D] font-medium p-5 text-center">
                        <div className="flex items-start justify-center gap-1.5">
                          <Image
                            alt="workshop"
                            src={employee.workShop?.image || "/workshop1.svg"}
                            width={25}
                            height={25}
                            className="rounded-lg object-cover"
                          />
                          <h1>{employee.workShop?.name}</h1>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#8E8E8E] text-center">
                        {employee.role === "ADMIN"
                          ? "Admin"
                          : employee.employeeRole === "CHEF"
                          ? "Chef"
                          : employee.employeeRole === "CUTTER"
                          ? "Decoupeur"
                          : employee.employeeRole === "TAILOR"
                          ? "Couteur"
                          : employee.employeeRole === "MANCHEUR"
                          ? "Mancheur"
                          : "Tapisier"}
                      </TableCell>
                      <TableCell className="text-[#8E8E8E] text-center">
                        {employee.username}
                      </TableCell>
                      <TableCell className="text-[#8E8E8E] text-center">
                        {employee.phone}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(employee);
                            }}
                            className="h-8 w-8 p-0 text-[#8E8E8E] hover:text-[#8E8E8E]">
                            <PenLine className="h-4 w-4" />
                            <span className="sr-only">Edit employee</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();

                              onOpen("deleteUser", {
                                user: employee,
                                onDeleteUser: () => onDelete(employee.id),
                              });
                            }}
                            className="h-8 w-8 p-0 text-[#CE2A2A] hover:text-[#CE2A2A]">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete employee</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto" showX={false}>
                    <EmployeeDetails employee={employee} />
                  </SheetContent>
                </Sheet>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

EmployeesTable.Skeleton = function SkeletonEmployeesTable() {
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
