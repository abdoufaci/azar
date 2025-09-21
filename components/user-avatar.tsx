"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useTransition } from "react";

function UserAvatar() {
  const [isPending, startTranstion] = useTransition();
  const router = useRouter();
  const user = useCurrentUser();

  return (
    <Avatar className="bg-brand/10">
      <AvatarImage
        src={`https://${process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME}/${user?.image?.id}`}
        className="object-cover"
      />
      <AvatarFallback className="bg-brand/10 cursor-pointer">
        {user?.name?.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
