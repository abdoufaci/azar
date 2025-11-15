"use server";

import { db } from "@/lib/db";

export const updateStockQty = async ({
  quantity,
  stockId,
}: {
  stockId: string;
  quantity: number;
}) => {
  await db.stock.update({
    where: {
      id: stockId,
    },
    data: {
      quantity,
    },
  });
};
