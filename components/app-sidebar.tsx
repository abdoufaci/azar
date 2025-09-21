"use client";

import * as React from "react";
import {
  Building2,
  Landmark,
  LayoutDashboard,
  ListTodo,
  Settings,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import Image from "next/image";
import {
  AdminNav,
  ClientDashboardNav,
  companiesNav,
} from "@/constants/navigations";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCurrentRole } from "@/hooks/use-current-role";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const mainPart = pathname.split("/")[2];
  const role = useCurrentRole();

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "block bg-white",
        mainPart === "companies" && "border-none"
      )}
      {...props}>
      <SidebarHeader className="border-b flex items-center justify-center h-[66px] border-r-0">
        <div className="flex flex-col items-center justify-center gap-1">
          <Image
            alt="logo"
            src={"/logo.svg"}
            height={100}
            width={200}
            className="object-cover"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={role === "ADMIN" ? AdminNav : ClientDashboardNav} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
