"use client";

import { cn } from "@/lib/utils";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { WorkShop } from "@prisma/client";
import Link from "next/link";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  workshop: WorkShop | null;
}

export function WorkShopSwitch({ searchParams, workshop }: Props) {
  const router = useRouter();
  const { target } = searchParams;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-medium text-[#06191D]">{workshop?.name}</h1>
      <div className="w-full h-12 border-b border-b-[#9BB5BB4D] flex">
        <Link href={`/management/workshop/${workshop?.id}?target=main`}>
          <div
            className={cn(
              "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
              target === "main" ? "border-b-2 border-b-brand" : ""
            )}>
            <h1
              className={cn(
                target === "main" ? "text-[#576070]" : "text-[#A2ABBD]"
              )}>
              Principal
            </h1>
          </div>
        </Link>
        <Link href={`/management/workshop/${workshop?.id}?target=demands`}>
          <div
            className={cn(
              "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
              target === "demands" ? "border-b-2 border-b-brand" : ""
            )}>
            <h1
              className={cn(
                target === "demands" ? "text-[#576070]" : "text-[#A2ABBD]"
              )}>
              Demandes
            </h1>
          </div>
        </Link>
      </div>
    </div>
  );
}
