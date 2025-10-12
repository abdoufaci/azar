"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const addDemandMaterial = async (name: string) => {
  var randomColor = require("randomcolor"); // import the script
  var color = randomColor();

  await db.demandMaterial.create({
    data: {
      name,
      color,
    },
  });

  revalidatePath("/");
};
