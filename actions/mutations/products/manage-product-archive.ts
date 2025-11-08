"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const manageProductArchive = async ({
  id,
  isArchived,
}: {
  id: string;
  isArchived: boolean;
}) => {
  await db.product.update({
    where: { id },
    data: {
      isArchived,
    },
  });

  revalidatePath("/");
};
