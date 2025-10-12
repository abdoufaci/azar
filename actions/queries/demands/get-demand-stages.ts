import { db } from "@/lib/db";

export const getDemandStages = async () => {
  return db.demandStage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};
