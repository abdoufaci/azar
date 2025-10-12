import { checkIsAdmin } from "@/actions/security/admin-check";
import { db } from "@/lib/db";

export const getProductions = async (
  currentPage: number,
  productionsPerPage: number,
  searchParams: Promise<{ [key: string]: string | undefined }>
) => {
  await checkIsAdmin();

  const { workshop, type, variant, status, search } = await searchParams;

  return await db.order.findMany({
    where: {
      status: "ACCEPTED",
      ...(search && {
        OR: [
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
      client: true,
      tissu: true,
      orderStage: true,
      pricing: true,
      subType: true,
      cutter: true,
      tailor: true,
      tapisier: true,
      user: true,
      variant: true,
      workShop: true,
      guest: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: productionsPerPage * (currentPage - 1),
    take: productionsPerPage,
  });
};
