"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const manageUserInvoice = async ({
  assurance,
  deposit,
  other,
  payment,
  userId,
  invoiceId,
  date,
}: {
  userId?: string;
  invoiceId?: string;
  assurance: number;
  deposit: number;
  payment: number;
  other: number;
  date: Date;
}) => {
  if (!userId) {
    throw new Error("User not found ");
  }

  invoiceId
    ? await db.invoice.update({
        where: { id: invoiceId },
        data: {
          assurance,
          deposit,
          other,
          payment,
        },
      })
    : await db.invoice.create({
        data: {
          userId,
          assurance,
          deposit,
          other,
          payment,
          createdAt: date,
        },
      });

  revalidatePath("/");
};
