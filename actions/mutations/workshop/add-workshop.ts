"use server";

import { checkIsAdmin } from "@/actions/security/admin-check";
import { ManageWorkShopformSchema } from "@/components/forms/manage-work-shop-form";
import { currentRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { id } from "date-fns/locale";
import { revalidatePath } from "next/cache";
import z from "zod";

export const addWorkShop = async (
  data: z.infer<typeof ManageWorkShopformSchema>
) => {
  await checkIsAdmin();

  const images = ["/workshop1.svg", "/workshop2.svg", "/workshop3.svg"];

  await db.workShop.create({
    data: {
      name: data.name,
      employees: {
        connect:
          data.employees.map((employee) => ({ id: employee.id || "" })) || [],
      },
      image: images[Math.floor(Math.random() * images.length)],
    },
  });

  revalidatePath("/");
};
