"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const addTissu = async ({ name }: { name: string }) => {
  const tissu = await db.tissu.create({
    data: {
      name,
    },
  });

  revalidatePath("/");

  return tissu;
};
