"use server";

import { checkIsAdmin } from "@/actions/security/admin-check";
import { AddEmployeeformSchema } from "@/components/forms/add-employee-form";
import { getUserByEmail } from "@/data/user";
import z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const addEmployee = async (
  data: z.infer<typeof AddEmployeeformSchema>
) => {
  await checkIsAdmin();
  const existingUser = await getUserByEmail(data.email);

  if (existingUser) {
    return { error: "Email already in use!" };
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
