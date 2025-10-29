"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmplyeeRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateOrderWorkers = async ({
  orderId,
  type,
  userId,
  currentRef,
}: {
  type: EmplyeeRole;
  orderId: string;
  userId: string;
  currentRef?: string;
}) => {
  const curr = await currentUser();

  let userCode: string | undefined = undefined;

  if (type === "CUTTER" && currentRef === "/") {
    const now = new Date();

    // get first day of current month and first day of next month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        cutterOrders: {
          where: {
            createdAt: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
        },
      },
    });

    const firstTwoLetters = user?.name.slice(0, 2).toUpperCase(); // e.g. "AB"
    const year = now.getFullYear().toString().slice(-2); // e.g. "25"
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // e.g. "10" for October

    userCode = `${firstTwoLetters}${year}${month}${
      (user?.cutterOrders?.length || 0) + 1 < 10 && "0"
    }${(user?.cutterOrders?.length || 0) + 1}`;
  }

  await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      ...(type === "CUTTER" &&
        currentRef === "/" && {
          orderId: userCode,
        }),
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
