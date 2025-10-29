"use server";

import { db } from "@/lib/db";
import { StockDisponibility } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateStockDisponibility = async ({
  stockId,
  disponibility,
}: {
  stockId: string;
  disponibility: StockDisponibility;
}) => {
  await db.stock.update({
    where: {
      id: stockId,
    },
    data: {
      disponibility,
    },
  });

  revalidatePath("/");
};
