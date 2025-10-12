"use server";

import { db } from "@/lib/db";
import { EmplyeeRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateOrderWorkers = async ({
  orderId,
  type,
  userId,
}: {
  type: EmplyeeRole;
  orderId: string;
  userId: string;
}) => {
  await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      ...(type === "CUTTER" && {
        cutterId: userId,
      }),
      ...(type === "TAILOR" && {
        tailorId: userId,
      }),
      ...(type === "TAPISIER" && {
        tapisierId: userId,
      }),
    },
  });

  revalidatePath("/");
};
