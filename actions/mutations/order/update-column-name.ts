"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateColumnName = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  await db.orderColumn.update({
    where: { id },
    data: { name },
  });

  revalidatePath("/");
};
