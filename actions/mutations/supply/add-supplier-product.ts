"use server";

import { db } from "@/lib/db";
import { SupplierProductFormData } from "@/schemas/supplier-product-schema";
import { revalidatePath } from "next/cache";

export const addSupplierProduct = async (data: SupplierProductFormData) => {
  const { type, ...rest } = data;

  const product = await db.supplierProduct.create({
    data: {
      ...rest,
      typeId: type.id,
    },
    include: {
      type: true,
    },
  });

  revalidatePath("/");

  return product;
};
