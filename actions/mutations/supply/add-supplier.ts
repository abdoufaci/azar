"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const addSupplier = async (name: string) => {
  const supplier = await db.supplier.create({
    data: {
      name,
    },
  });

  revalidatePath("/");

  return supplier;
};
