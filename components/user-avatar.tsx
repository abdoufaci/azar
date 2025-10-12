"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ExtendedUser } from "@/types/next-auth";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logout } from "@/actions/auth/logout";

interface Props {
  isHeader?: boolean;
}

function UserAvatar({ isHeader = false }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <div className="flex items-center gap-4">
          {!isHeader && (
            <h1 className="text-[#373434] max-md:!hidden font-medium">
              {user?.name}
            </h1>
          )}
          <Avatar className="w-10 h-10">
            <AvatarImage
              className="object-cover"
              src={`https://${process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME}/${user?.image?.id}`}
            />
            <AvatarFallback className="bg-brand text-white">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              logout().then(() => router.push("/"));
            })
          }
          className="bg-[#FF00000F] text-[#FF0000] hover:!text-[#FF0000] hover:!bg-[#FF00000F] focus-within:bg-[#FF00000F] cursor-pointer">
          déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserAvatar;
