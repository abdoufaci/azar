"use server";

import { checkIsAdmin } from "@/actions/security/admin-check";
import { ManageEmployeeformSchema } from "@/components/forms/manage-employee-form";
import { getUserByEmail } from "@/data/user";
import z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { UserWithWorkshop } from "@/types/types";

export const updateEmployee = async (
  data: z.infer<typeof ManageEmployeeformSchema>,
  user?: UserWithWorkshop
) => {
  if (!user?.id) {
    throw new Error("User ID is required for updating an employee");
  }

  await checkIsAdmin();
  let hashedPassowrd: string | null = null;
  if (!!data?.password) {
    hashedPassowrd = await bcrypt.hash(data.password!, 10);
  }

  const { password, workshop, role, ...rest } = data;

  await db.user.update({
    where: { id: user.id },
    data: {
      ...rest,
      password: !!hashedPassowrd ? hashedPassowrd : user.password,
      role: "EMPLOYEE",
      employeeRole: role,
      workShopId: workshop.id,
    },
  });

  revalidatePath("/");

  return { success: "user" };
};
