import { checkIsAdmin } from "@/actions/security/admin-check";
import { db } from "@/lib/db";

export const getProductionsCount = async ({
  searchParams,
  workshopId,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;

  workshopId?: string;
}) => {
  await checkIsAdmin();

  const { workshop, type, variant, status, search } = await searchParams;

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
  });
};
