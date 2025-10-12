"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DemandFormData } from "@/schemas/demand-schema";
import { revalidatePath } from "next/cache";
import ShortUniqueId from "short-unique-id";

export const addDemand = async (data: DemandFormData) => {
  const user = await currentUser();

  const uid = new ShortUniqueId({ length: 10 });
  const demandId = uid.rnd();

  await db.demand.create({
    data: {
      demandId,
      demand: data.demand,
      priority: data.priority,
      workShopId: data.workShopId,
      materialId: data.material.id,
      userId: user?.id || "",
      stageId: "cmgo5lwnj0000kpi84xy2rzn3",
    },
  });

  revalidatePath("/");
};
