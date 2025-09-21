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

interface Employee {
  id: number;
  client: string;
  atelier: string;
  email: string;
  psuedo: string;
  numero: string;
}

const employees: Employee[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  client: "Nom de Employée",
  atelier: "Ouled Belhadj",
  email: "Employee@gmail.com",
  psuedo: "NomEmployée",
  numero: "051682548",
}));

export function EmployeesTable() {
  const handleEdit = (id: number) => {
    console.log("Edit employee:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete employee:", id);
  };

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
              <TableRow
                key={employee.id}
                className="hover:bg-muted/50 text-[#95A1B1]">
                <TableCell className="text-[#8E8E8E] flex items-center justify-center">
                  <div className="rounded-full px-8 py-2 w-fit border border-[#95A1B14F] text-[#95A1B1] font-medium">
                    {employee.client}
                  </div>
                </TableCell>
                <TableCell className="text-[#06191D] font-medium p-5 text-center">
                  {employee.atelier}
                </TableCell>
                <TableCell className="text-[#8E8E8E] text-center">
                  {employee.email}
                </TableCell>
                <TableCell className="text-[#8E8E8E] text-center">
                  {employee.psuedo}
                </TableCell>
                <TableCell className="text-[#8E8E8E] text-center">
                  {employee.numero}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(employee.id)}
                      className="h-8 w-8 p-0 text-[#8E8E8E] hover:text-[#8E8E8E]">
                      <PenLine className="h-4 w-4" />
                      <span className="sr-only">Edit employee</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                      className="h-8 w-8 p-0 text-[#CE2A2A] hover:text-[#CE2A2A]">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete employee</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
