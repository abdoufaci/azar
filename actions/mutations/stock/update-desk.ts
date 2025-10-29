"use server";

import { db } from "@/lib/db";
import { DeskFormData } from "@/schemas/desk-schema";
import { revalidatePath } from "next/cache";

export const updateDesk = async ({
  data,
  deskId,
}: {
  data: DeskFormData;
  deskId: string;
}) => {
  await db.desk.update({
    where: { id: deskId },
    data: {
      ...data,
    },
  });

  revalidatePath("/");
};
