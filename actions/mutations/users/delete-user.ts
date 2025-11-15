"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteUser = async (id: string) => {
  await db.user.delete({
    where: { id },
  });

  revalidatePath("/");
};
