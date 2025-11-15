"use server";

import { db } from "@/lib/db";
import { StockFormData } from "@/schemas/stock-schema";
import { revalidatePath } from "next/cache";
import ShortUniqueId from "short-unique-id";

export const addStock = async (data: StockFormData) => {
  const uid = new ShortUniqueId({ length: 10 });

  const ref = uid.rnd();

  const stock = await db.stock.create({
    data: {
      name: data.name,
      quantity: data.quantity,
      wareHouseId: data.warehouse.id,
      typeId: data.type.id,
      disponibility: data.disponibility,
      ref,
    },
    include: {
      type: true,
      wareHouse: true,
    },
  });

  revalidatePath("/");

  return stock;
};
