"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateOrderStage = async ({
  orderId,
  orderStageId,
  oldStageId,
}: {
  orderStageId: string;
  oldStageId: string;
  orderId: string;
}) => {
  const user = await currentUser();

  await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      orderStageId,
      history: {
        create: {
          userId: user?.id || "",
          type: "STAGE",
          newOrderStageId: orderStageId,
          oldOrderStageId: oldStageId,
        },
      },
    },
  });

  revalidatePath("/");
};
