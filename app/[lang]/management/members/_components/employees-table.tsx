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
}

export function EmployeesTable({ employees, onEdit }: Props) {
  const handleEdit = (id: string) => {
    console.log("Edit employee:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete employee:", id);
  };

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
                Email
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
            {employees.map((employee) => (
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
                      {employee.email}
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
                            handleDelete(employee.id);
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
