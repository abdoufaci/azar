"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const manageDemandArchive = async ({
  id,
  isArchived,
}: {
  id: string;
  isArchived: boolean;
}) => {
  await db.demand.update({
    where: { id },
    data: {
      isArchived,
    },
  });

  revalidatePath("/");
};
