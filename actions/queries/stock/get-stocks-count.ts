import { checkIsAdmin } from "@/actions/security/admin-check";
import { db } from "@/lib/db";
import { StockDisponibility } from "@prisma/client";

export const getStocksCount = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  await checkIsAdmin();

  const { workshop, type, disponibility, search } = await searchParams;

  return await db.stock.count({
    where: {
      ...(workshop && { workShopId: workshop }),
      ...(type && { typeId: type }),
      ...(disponibility && {
        disponibility: disponibility as StockDisponibility,
      }),
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },
  });
};
