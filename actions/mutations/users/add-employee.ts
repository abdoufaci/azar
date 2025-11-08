"use server";

import { checkIsAdmin } from "@/actions/security/admin-check";
import { ManageEmployeeformSchema } from "@/components/forms/manage-employee-form";
import { getUserByUsername } from "@/data/user";
import z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const addEmployee = async (
  data: z.infer<typeof ManageEmployeeformSchema>
) => {
  await checkIsAdmin();
  const existingUser = await getUserByUsername(data.username);

  if (existingUser) {
    return { error: "Pseudo already in use!" };
  }
  const hashedPassowrd = await bcrypt.hash(data.password!, 10);

  const { password, workshop, role, ...rest } = data;

  const user = await db.user.create({
    data: {
      ...rest,
      password: hashedPassowrd,
      role: "EMPLOYEE",
      employeeRole: role,
      workShopId: workshop.id,
    },
  });

  revalidatePath("/");

  return { success: user };
};
