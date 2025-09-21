"use client";

import { ExtendedUser } from "@/types/next-auth";
import UserAvatar from "./user-avatar";

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
    <div className="w-full h-[66px] border-b p-5 flex items-center justify-end sticky top-0 left-0 z-50 bg-white">
      <div className="flex items-center gap-3">
        {/* {!mainPart && (
          <>
            <Cart dict={dict} />
          </>
        )} */}
        <UserAvatar />
      </div>
    </div>
  );
}

export default ManagementHeader;
