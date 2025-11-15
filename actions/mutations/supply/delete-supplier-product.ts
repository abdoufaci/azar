"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteSupplierProduct = async ({ id }: { id: string }) => {
  await db.supplierProduct.delete({
    where: { id },
  });

  revalidatePath("/");
};
