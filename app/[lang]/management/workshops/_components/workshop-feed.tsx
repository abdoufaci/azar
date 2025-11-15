"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useWorkShopsQuery } from "@/hooks/use-workshops-query";
import Link from "next/link";
import WorkshopCard from "./workshop-card";

function WorkshopFeed() {
  const { data: workshops, isPending } = useWorkShopsQuery(true);
  return (
    <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 min-[1800px]:!grid-cols-4 gap-6">
      {isPending ? (
        <>
          <Skeleton className="h-56 w-96" />
          <Skeleton className="h-56 w-96" />
          <Skeleton className="h-56 w-96" />
          <Skeleton className="h-56 w-96" />
          <Skeleton className="h-56 w-96" />
          <Skeleton className="h-56 w-96" />
          <Skeleton className="h-56 w-96" />
        </>
      ) : (
        workshops.map((item) => (
          <Link href={`/management/workshop/${item?.id}`} key={item.id}>
            <WorkshopCard
              //@ts-ignore
              workshop={item}
            />
          </Link>
        ))
      )}
    </div>
  );
}

export default WorkshopFeed;
