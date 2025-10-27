"use server";

import { checkIsAdmin } from "@/actions/security/admin-check";
import { ManageInvoiceformSchema } from "@/components/forms/manage-invoice-form";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import z from "zod";

export const updateInvoiceDetails = async ({
  data,
  userId,
}: {
  data: z.infer<typeof ManageInvoiceformSchema>;
  userId?: string;
}) => {
  checkIsAdmin();

  if (!userId) {
    throw new Error("User is required");
  }

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/");
};
