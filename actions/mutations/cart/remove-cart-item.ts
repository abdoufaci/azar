"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const removeCartItem = async ({ itemId }: { itemId: string }) => {
  await db.cartItem.delete({
    where: { id: itemId },
  });

  revalidatePath("/");
};
