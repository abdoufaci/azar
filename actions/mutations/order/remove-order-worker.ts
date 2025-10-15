"use server";

import { currentUser } from "@/lib/auth";
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
  const curr = await currentUser();

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
      employeeHistory: {
        create: {
          type: "EMPLOYEE",
          text: "remove",
          userId: curr?.id || "",
          orderId,
        },
      },
    },
  });

  revalidatePath("/");
};
