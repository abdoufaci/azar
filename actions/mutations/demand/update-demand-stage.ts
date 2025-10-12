"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateDemandStage = async ({
  demandId,
  stageId,
}: {
  stageId: string;
  demandId: string;
}) => {
  await db.demand.update({
    where: {
      id: demandId,
    },
    data: {
      stageId,
    },
  });

  revalidatePath("/");
};
