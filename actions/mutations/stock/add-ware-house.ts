"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const addWareHouse = async (name: string) => {
  const wareHouse = await db.wareHouse.create({
    data: {
      name,
    },
  });

  revalidatePath("/");
  return wareHouse;
};
