"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmployeesTable } from "./employees-table";
import { ClientsTable } from "./clients-table";
import { ManageClientForm } from "@/components/forms/manage-client-form";
import { ManageEmployeeForm } from "@/components/forms/manage-employee-form";
import { User, WorkShop } from "@prisma/client";
import { UserInTable } from "@/types/types";

type TabType = "client" | "employees";

interface Props {
  workshops: WorkShop[];
  clients: UserInTable[];
  employees: UserInTable[];
}

export function MembersInterface({ workshops, clients, employees }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("client");
  const [isAdd, setIsAdd] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInTable | null>(null);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-medium text-[#06191D]">Members</h1>
      <div className="w-full h-12 border-b border-b-[#9BB5BB4D] flex">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsAdd(false);
            setActiveTab("client");
          }}
          className={cn(
            "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
            activeTab === "client" ? "border-b-2 border-b-brand" : ""
          )}>
          <h1
            className={cn(
              activeTab === "client" ? "text-[#576070]" : "text-[#A2ABBD]"
            )}>
            Client
          </h1>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (activeTab === "client") {
                setIsAdd(true);
              }
            }}
            className={cn(
              "h-4 w-4 rounded-md border  flex items-center justify-center cursor-pointer",
              activeTab === "client" ? "border-[#5A5A5A]" : "border-white"
            )}>
            <Plus
              className={cn(
                "h-3 w-3",
                activeTab === "client" ? "text-[#5A5A5A]" : "text-white"
              )}
            />
          </div>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsAdd(false);
            setActiveTab("employees");
          }}
          className={cn(
            "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
            activeTab === "employees" ? "border-b-2 border-b-brand" : ""
          )}>
          <h1
            className={cn(
              activeTab === "employees" ? "text-[#576070]" : "text-[#A2ABBD]"
            )}>
            Employées
          </h1>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (activeTab === "employees") {
                setIsAdd(true);
              }
            }}
            className={cn(
              "h-4 w-4 rounded-md border  flex items-center justify-center cursor-pointer",
              activeTab === "employees" ? "border-[#5A5A5A]" : "border-white"
            )}>
            <Plus
              className={cn(
                "h-3 w-3",
                activeTab === "employees" ? "text-[#5A5A5A]" : "text-white"
              )}
            />
          </div>
        </div>
      </div>
      {activeTab === "client" && (
        <>
          {isAdd || !!selectedUser ? (
            <div className="w-full max-w-xl mx-auto space-y-5">
              <div className="space-y-1">
                <h5 className="text-sm text-brand">
                  {!!selectedUser ? "Modifier" : "Ajouter"} un client
                </h5>
                <h1 className="text-3xl font-medium text-[#06191D]">
                  Les Informations de <span className="text-brand">Client</span>
                </h1>
              </div>
              <ManageClientForm
                onCancel={() => {
                  setSelectedUser(null);
                  setIsAdd(false);
                }}
                user={selectedUser}
              />
            </div>
          ) : (
            <ClientsTable
              clients={clients}
              onEdit={(user) => setSelectedUser(user)}
            />
          )}
        </>
      )}
      {activeTab === "employees" && (
        <>
          {isAdd || !!selectedUser ? (
            <div className="w-full max-w-xl mx-auto space-y-5">
              <div className="space-y-1">
                <h5 className="text-sm text-brand">
                  {!!selectedUser ? "Modifier" : "Ajouter"} un employée
                </h5>
                <h1 className="text-3xl font-medium text-[#06191D]">
                  Les Informations de{" "}
                  <span className="text-brand">Employée</span>
                </h1>
              </div>
              <ManageEmployeeForm
                workshops={workshops}
                onCancel={() => {
                  setSelectedUser(null);
                  setIsAdd(false);
                }}
                user={selectedUser}
              />
            </div>
          ) : (
            <EmployeesTable
              employees={employees}
              onEdit={(user) => setSelectedUser(user)}
            />
          )}
        </>
      )}
    </div>
  );
}
