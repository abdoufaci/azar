import { db } from "@/lib/db";
import { DemandPriority } from "@prisma/client";

export const getDemands = async ({
  currentPage,
  demandsPerPage,
  searchParams,
  workshopId,
}: {
  currentPage: number;
  demandsPerPage: number;
  searchParams: Promise<{ [key: string]: string | undefined }>;
  workshopId?: string;
}) => {
  const { workshop, material, status, priority, search } = await searchParams;

  return await db.demand.findMany({
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
    include: {
      material: true,
      stage: true,
      workshop: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: demandsPerPage * (currentPage - 1),
    take: demandsPerPage,
  });
};
