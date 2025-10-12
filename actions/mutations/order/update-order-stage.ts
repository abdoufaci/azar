"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateOrderStage = async ({
  orderId,
  orderStageId,
}: {
  orderStageId: string;
  orderId: string;
}) => {
  await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      orderStageId,
    },
  });

  revalidatePath("/");
};
