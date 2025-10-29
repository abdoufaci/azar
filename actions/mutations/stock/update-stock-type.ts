"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateStockType = async ({
  stockId,
  typeId,
}: {
  typeId: string;
  stockId: string;
}) => {
  await db.stock.update({
    where: {
      id: stockId,
    },
    data: {
      typeId,
    },
  });

  revalidatePath("/");
};
