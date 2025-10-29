"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const addStockType = async (name: string) => {
  var randomColor = require("randomcolor"); // import the script
  var color = randomColor();

  await db.stockType.create({
    data: {
      name,
      color,
    },
  });

  revalidatePath("/");
};
