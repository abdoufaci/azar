"use client";

import { ExtendedUser } from "@/types/next-auth";
import UserAvatar from "./user-avatar";
import { SidebarTrigger } from "./ui/sidebar";
import { Menu } from "lucide-react";

const title = {
  admin: "Dashboard",
  orders: "Orders",
  companies: "Companies",
  users: "Users",
  payments: "Payment",
  settings: "Settings",
  dashboard: "Dashboard",
};

interface Props {
  user?: ExtendedUser;
}

function ManagementHeader({ user }: Props) {
  return (
    <div className="w-full h-[66px] border-b p-5 flex items-center justify-between md:!justify-end sticky top-0 left-0 z-50 bg-white">
      <SidebarTrigger className="md:!hidden">
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      <div className="flex items-center gap-3">
        <UserAvatar />
      </div>
    </div>
  );
}

export default ManagementHeader;
