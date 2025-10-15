"use server";

import { currentUser } from "@/lib/auth";
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
  const curr = await currentUser();

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
      history: {
        create: {
          userId: curr?.id || "",
          type: "EMPLOYEE",
          employeeId: userId,
        },
      },
    },
  });

  revalidatePath("/");
};
