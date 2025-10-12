"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const addDemandStage = async (name: string) => {
  var randomColor = require("randomcolor"); // import the script
  var color = randomColor();

  await db.demandStage.create({
    data: {
      name,
      color,
    },
  });

  revalidatePath("/");
};
