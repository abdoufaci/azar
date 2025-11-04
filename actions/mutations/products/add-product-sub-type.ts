"use server";

import { db } from "@/lib/db";
import { ProductCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addProductSubtype = async ({
  category,
  name,
}: {
  name: string;
  category: ProductCategory;
}) => {
  const type = await db.productSubtype.create({
    data: {
      name,
      category,
    },
  });

  revalidatePath("/");

  return type;
};
