"use server";

import { db } from "@/lib/db";
import { OrderColumnType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addColumn = async (type: OrderColumnType) => {
  await db.orderColumn.create({
    data: {
      name:
        type === "DATE"
          ? "Date"
          : type === "PERSON"
          ? "Person"
          : type === "STATUS"
          ? "Status"
          : "Text",
      type,
      ...(type === "STATUS" && {
        statuses: {
          createMany: {
            data: [
              {
                name: "En Cours..",
                color: "#1E78FF",
              },
              {
                name: "Fini",
                color: "#21D954",
              },
              {
                name: "Annulé",
                color: "#CE2A2A",
              },
            ],
          },
        },
      }),
    },
  });

  revalidatePath("/");
};
