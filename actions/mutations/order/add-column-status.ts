"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const addColumnStatus = async ({
  columnId,
  name,
}: {
  columnId: string;
  name: string;
}) => {
  var randomColor = require("randomcolor");
  var color = randomColor();

  await db.orderColumnStatus.create({
    data: {
      columnId,
      color,
      name,
    },
  });

  revalidatePath("/");
};
