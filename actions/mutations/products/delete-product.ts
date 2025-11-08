"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteProduct = async (id: string) => {
  await db.product.delete({
    where: { id },
  });

  revalidatePath("/");
};
