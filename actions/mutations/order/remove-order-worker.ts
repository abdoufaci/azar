"use server";

import { db } from "@/lib/db";
import { EmplyeeRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const removeOrderWorker = async ({
  orderId,
  type,
  userId,
}: {
  type: EmplyeeRole;
  orderId: string;
  userId: string;
}) => {
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(type === "CUTTER" && {
        cutterOrders: { disconnect: { id: orderId } },
      }),
      ...(type === "TAILOR" && {
        tailorOrders: { disconnect: { id: orderId } },
      }),
      ...(type === "TAPISIER" && {
        tapisierOrders: { disconnect: { id: orderId } },
      }),
    },
  });

  revalidatePath("/");
};
