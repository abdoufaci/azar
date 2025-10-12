"use server";

import { checkIsAdmin } from "@/actions/security/admin-check";
import { getUserByEmail } from "@/data/user";
import z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ManageClientformSchema } from "@/components/forms/manage-client-form";
import { UserWithWorkshop } from "@/types/types";

export const updateClient = async (
  data: z.infer<typeof ManageClientformSchema>,
  user?: UserWithWorkshop
) => {
  if (!user?.id) {
    throw new Error("User ID is required for updating a client");
  }
  await checkIsAdmin();
  let hashedPassowrd: string | null = null;
  if (!!data?.password) {
    hashedPassowrd = await bcrypt.hash(data.password!, 10);
  }

  const { password, ...rest } = data;

  await db.user.update({
    where: { id: user.id },
    data: {
      ...rest,
      password: !!hashedPassowrd ? hashedPassowrd : undefined,
      role: "CLIENT",
    },
  });

  revalidatePath("/");

  return { success: "user" };
};
