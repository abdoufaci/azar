"use server";

import { db } from "@/lib/db";
import { SupplierProductInTable } from "@/types/types";
import { WareHouse } from "@prisma/client";
import { revalidatePath } from "next/cache";
import ShortUniqueId from "short-unique-id";

export const addSupply = async ({
  products,
  supplierId,
  wareHouseId,
}: {
  products: SupplierProductInTable[];
  wareHouseId: string;
  supplierId: string;
}) => {
  const uid = new ShortUniqueId({ length: 10 });
  const ref = uid.rnd();

  const supply = await db.supply.create({
    data: {
      products: { connect: products.map((product) => ({ id: product.id })) },
      supplierId,
      wareHouseId,
      ref,
    },
    include: {
      products: { include: { type: true } },
      supplier: true,
      warehouse: true,
    },
  });

  revalidatePath("/");

  return supply;
};
