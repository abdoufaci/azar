"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const linkOrderWithProduction = async ({
  clientId,
  guestId,
  orderId,
  clientOderId,
  note,
}: {
  clientId?: string | null;
  guestId?: string | null;
  orderId?: string;
  clientOderId?: string;
  note?: string;
}) => {
  await db.$transaction([
    db.order.update({
      where: {
        id: orderId,
      },
      data: {
        acceptedAt: new Date(),
        ...(clientId && {
          clientId,
        }),
        ...(guestId && {
          guestId,
        }),
        note,
      },
    }),
    db.order.delete({
      where: { id: clientOderId },
    }),
  ]);

  revalidatePath("/");
};
