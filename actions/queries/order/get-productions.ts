import { checkIsAdmin } from "@/actions/security/admin-check";
import { db } from "@/lib/db";

export const getProductions = async ({
  currentPage,
  productionsPerPage,
  searchParams,
  workshopId,
}: {
  currentPage: number;
  productionsPerPage: number;
  searchParams: Promise<{ [key: string]: string | undefined }>;
  workshopId?: string;
}) => {
  await checkIsAdmin();

  const { workshop, type, variant, status, search } = await searchParams;

  const baseOrderInclude = {
    client: true,
    tissu: true,
    orderStage: true,
    pricing: true,
    subType: true,
    cutter: true,
    tailor: true,
    tapisier: true,
    mancheur: true,
    user: true,
    variant: true,
    workShop: true,
    guest: true,
    extraCells: {
      include: {
        person: true,
        status: true,
      },
    },
  };

  return await db.order.findMany({
    where: {
      status: "ACCEPTED",
      ...(search && {
        OR: [
          {
            orderId: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            client: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            client: {
              username: {
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
          {
            user: {
              username: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            tissu: {
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
      ...(type && {
        subtypeId: type,
      }),
      ...(variant && {
        variantId: variant,
      }),
      ...(status && {
        orderStageId: status,
      }),
    },
    include: {
      ...baseOrderInclude,
    },
    orderBy: {
      acceptedAt: "desc",
    },
    skip: productionsPerPage * (currentPage - 1),
    take: productionsPerPage,
  });
};
