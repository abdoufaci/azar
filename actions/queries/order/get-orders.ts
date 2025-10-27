import { checkIsAdmin } from "@/actions/security/admin-check";
import { db } from "@/lib/db";

export const getOrders = async ({
  currentPage,
  ordersPerPage,
  searchParams,
  clientId,
}: {
  currentPage: number;
  ordersPerPage: number;
  searchParams: Promise<{ [key: string]: string | undefined }>;
  clientId?: string;
}) => {
  await checkIsAdmin();

  const { type, variant, search, client } = await searchParams;

  return await db.order.findMany({
    where: {
      ...(clientId && { clientId }),
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
      ...(client === "B2B" && {
        clientId: {
          not: null,
        },
      }),
      ...(client === "B2C" && {
        guestId: {
          not: null,
        },
      }),
      ...(type && {
        subtypeId: type,
      }),
      ...(variant && {
        variantId: variant,
      }),
    },
    include: {
      client: true,
      tissu: true,
      subType: true,
      user: true,
      variant: true,
      guest: true,
      ...(clientId && {
        orderStage: true,
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: ordersPerPage * (currentPage - 1),
    take: ordersPerPage,
  });
};
