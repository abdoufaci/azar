"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const manageProductionArchive = async ({
  id,
  isArchived,
}: {
  id: string;
  isArchived: boolean;
}) => {
  await db.order.update({
    where: { id },
    data: {
      isArchived,
    },
  });

  revalidatePath("/");
};
