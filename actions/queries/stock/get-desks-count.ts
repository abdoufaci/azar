import { checkIsAdmin } from "@/actions/security/admin-check";
import { db } from "@/lib/db";
import { DeskType, StockDisponibility } from "@prisma/client";

export const getDesksCount = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  await checkIsAdmin();
  let dateFrom: Date | null = null;
  let dateTo: Date | null = null;

  const { type, search } = await searchParams;

  if ((await searchParams)?.dateFrom) {
    dateFrom = new Date((await searchParams)?.dateFrom!);
  }

  if ((await searchParams)?.dateTo) {
    dateTo = new Date((await searchParams)?.dateTo!);
    dateTo.setDate(dateTo.getDate() + 1);
  }

  return await db.desk.count({
    where: {
      ...(dateFrom &&
        dateTo && {
          createdAt: {
            gte: dateFrom,
            lte: dateTo,
          },
        }),
      ...(type && { type: type as DeskType }),
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
