import { db } from "@/lib/db";

export const getProductSubTypes = async () => {
  return await db.productSubtype.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};
