"use server";

import { db } from "@/lib/db";
import { StockFormData } from "@/schemas/stock-schema";
import { revalidatePath } from "next/cache";
import ShortUniqueId from "short-unique-id";

export const addStock = async (data: StockFormData) => {
  const uid = new ShortUniqueId({ length: 10 });

  const ref = uid.rnd();

  await db.stock.create({
    data: {
      name: data.name,
      intialQuantity: data.intialQuantity,
      currentQuantity: data.currentQuantity,
      workShopId: data.workShopId,
      typeId: data.type.id,
      disponibility: data.disponibility,
      ref,
    },
  });

  revalidatePath("/");
};
