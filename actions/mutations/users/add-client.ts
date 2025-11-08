"use server";

import { checkIsAdmin } from "@/actions/security/admin-check";
import { getUserByUsername } from "@/data/user";
import z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ManageClientformSchema } from "@/components/forms/manage-client-form";

export const addClient = async (
  data: z.infer<typeof ManageClientformSchema>
) => {
  await checkIsAdmin();
  const existingUser = await getUserByUsername(data.username);

  if (existingUser) {
    return { error: "Pseudo already in use!" };
  }
  const hashedPassowrd = await bcrypt.hash(data.password!, 10);

  const { password, ...rest } = data;

  const user = await db.user.create({
    data: {
      ...rest,
      password: hashedPassowrd,
      role: "CLIENT",
    },
  });

  revalidatePath("/");

  return { success: user };
};
