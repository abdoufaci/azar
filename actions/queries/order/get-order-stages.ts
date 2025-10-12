import { db } from "@/lib/db";

export const getOrderStages = async () => {
  return await db.orderStage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};
