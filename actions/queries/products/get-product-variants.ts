import { db } from "@/lib/db";

export const getProductVariants = async () => {
  return await db.productVariant.findMany({
    include: {
      pricings: {
        include: {
          subtype: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
