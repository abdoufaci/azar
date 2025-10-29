"use server";

import { db } from "@/lib/db";

export const updateStockQty = async ({
  currentQuantity,
  intialQuantity,
  stockId,
}: {
  stockId: string;
  intialQuantity: number;
  currentQuantity: number;
}) => {
  await db.stock.update({
    where: {
      id: stockId,
    },
    data: {
      currentQuantity,
      intialQuantity,
    },
  });
};
