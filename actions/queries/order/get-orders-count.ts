import { checkIsAdmin } from "@/actions/security/admin-check";
import { db } from "@/lib/db";

export const getOrdersCount = async (
  searchParams: Promise<{ [key: string]: string | undefined }>
) => {
  await checkIsAdmin();

  const { type, variant, status, search } = await searchParams;

  return await db.order.count({
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
  });
};
