"use server";

import { db } from "@/lib/db";
import { DeskFormData } from "@/schemas/desk-schema";
import { StockFormData } from "@/schemas/stock-schema";
import { revalidatePath } from "next/cache";
import ShortUniqueId from "short-unique-id";

export const addDesk = async (data: DeskFormData) => {
  const uid = new ShortUniqueId({ length: 10 });
  const ref = uid.rnd();

  await db.desk.create({
    data: {
      ...data,
      ref,
    },
  });

  revalidatePath("/");
};
