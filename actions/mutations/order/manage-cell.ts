"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const manageCell = async ({
  columnId,
  orderId,
  date,
  personId,
  text,
  statusId,
  cellId,
}: {
  columnId: string;
  orderId: string;
  personId?: string | null;
  date?: Date;
  text?: string;
  statusId?: string;
  cellId?: string;
}) => {
  cellId
    ? await db.orderColumnCell.update({
        where: {
          id: cellId,
        },
        data: {
          personId,
          date,
          text,
          statusId,
        },
      })
    : await db.orderColumnCell.create({
        data: {
          orderColumnId: columnId,
          orderId,
          personId,
          date,
          text,
          statusId,
        },
      });

  revalidatePath("/");
};
