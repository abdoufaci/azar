"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export function OrdersSwitch({ searchParams }: Props) {
  const { client } = searchParams;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-medium text-[#06191D]">Command De Client</h1>
      <div className="w-full h-12 border-b border-b-[#9BB5BB4D] flex">
        <Link href={"/management/orders?client=B2B"}>
          <div
            className={cn(
              "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
              client === "B2B" ? "border-b-2 border-b-brand" : ""
            )}>
            <h1
              className={cn(
                client === "B2B" ? "text-[#576070]" : "text-[#A2ABBD]"
              )}>
              B2B
            </h1>
          </div>
        </Link>

        <Link href={"/management/orders?client=B2C"}>
          <div
            className={cn(
              "h-full flex justify-center items-center gap-4 w-32 cursor-pointer",
              client === "B2C" ? "border-b-2 border-b-brand" : ""
            )}>
            <h1
              className={cn(
                client === "B2C" ? "text-[#576070]" : "text-[#A2ABBD]"
              )}>
              B2C
            </h1>
          </div>
        </Link>
      </div>
    </div>
  );
}
