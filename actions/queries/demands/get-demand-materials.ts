import { db } from "@/lib/db";

export const getDemandMaterials = async () => {
  return await db.demandMaterial.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};
