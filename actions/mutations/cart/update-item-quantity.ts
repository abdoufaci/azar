"use server";

import { db } from "@/lib/db";

export const updateItemQuantity = async ({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) => {
  await db.cartItem.update({
    where: { id: itemId },
    data: {
      quantity,
    },
  });
};
