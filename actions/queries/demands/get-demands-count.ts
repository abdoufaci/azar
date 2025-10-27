import { db } from "@/lib/db";
import { DemandPriority } from "@prisma/client";

export const getDemandsCount = async ({
  searchParams,
  workshopId,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
  workshopId?: string;
}) => {
  const { workshop, material, status, priority, search } = await searchParams;
  return await db.demand.count({
    where: {
      ...(search && {
        OR: [
          {
            demand: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            material: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            workshop: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            user: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      }),
      ...(workshop && {
        workShopId: workshop,
      }),
      ...(workshopId && {
        workShopId: workshopId,
      }),
      ...(status && {
        stageId: status,
      }),
      ...(material && {
        materialId: material,
      }),
      ...(priority && {
        priority: priority as DemandPriority,
      }),
    },
  });
};
