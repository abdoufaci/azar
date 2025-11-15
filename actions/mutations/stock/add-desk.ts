"use server";

import { db } from "@/lib/db";
import { DeskFormData } from "@/schemas/desk-schema";
import { StockFormData } from "@/schemas/stock-schema";
import { revalidatePath } from "next/cache";
import ShortUniqueId from "short-unique-id";

export const addDesk = async (data: DeskFormData) => {
  const uid = new ShortUniqueId({ length: 10 });
  const ref = uid.rnd();

  const { amount, ...rest } = data;

  const desk = await db.desk.create({
    data: {
      ...rest,
      amount: data.type === "DEPOSIT" ? amount : -1 * amount,
      ref,
    },
  });

  revalidatePath("/");
  return desk;
};
