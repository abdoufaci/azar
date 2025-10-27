import { checkIsAdmin } from "@/actions/security/admin-check";
import { db } from "@/lib/db";

export const getOrdersCount = async ({
  searchParams,
  clientId,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
  clientId?: string;
}) => {
  await checkIsAdmin();

  const { type, variant, search } = await searchParams;

  return await db.order.count({
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
      ...(type && {
        subtypeId: type,
      }),
      ...(variant && {
        variantId: variant,
      }),
    },
  });
};
