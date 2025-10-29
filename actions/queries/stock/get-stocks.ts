import { checkIsAdmin } from "@/actions/security/admin-check";
import { db } from "@/lib/db";
import { StockDisponibility } from "@prisma/client";

export const getStocks = async ({
  currentPage,
  stocksPerPage,
  searchParams,
}: {
  currentPage: number;
  stocksPerPage: number;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  await checkIsAdmin();

  const { workshop, type, disponibility, search } = await searchParams;

  return await db.stock.findMany({
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
    include: {
      type: true,
      workshop: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: stocksPerPage * (currentPage - 1),
    take: stocksPerPage,
  });
};
