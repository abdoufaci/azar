import { db } from "@/lib/db";

export const getWorkShopById = async (workshopId: string) => {
  return await db.workShop.findUnique({
    where: { id: workshopId },
  });
};
