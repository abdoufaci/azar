"use server";

import { db } from "@/lib/db";
import { SupplierProductFormData } from "@/schemas/supplier-product-schema";
import { revalidatePath } from "next/cache";

export const updateSupplierProduct = async ({
  data,
  id,
}: {
  id: string;
  data: SupplierProductFormData;
}) => {
  const { type, ...rest } = data;

  const product = await db.supplierProduct.update({
    where: { id },
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
