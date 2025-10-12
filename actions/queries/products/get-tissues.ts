import { db } from "@/lib/db";

export const getTissues = async () => {
  return await db.tissu.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};
