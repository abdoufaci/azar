import { db } from "@/lib/db";

export const getStockTypes = async () => {
  return await db.stockType.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};
