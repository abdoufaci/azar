"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateDemandStage = async ({
  demandId,
  stageId,
  oldStageId,
}: {
  stageId: string;
  oldStageId: string;
  demandId: string;
}) => {
  const user = await currentUser();

  await db.demand.update({
    where: {
      id: demandId,
    },
    data: {
      stageId,
      history: {
        create: {
          userId: user?.id || "",
          newStageId: stageId,
          oldStageId: oldStageId,
        },
      },
    },
  });

  revalidatePath("/");
};
