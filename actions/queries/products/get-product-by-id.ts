import { db } from "@/lib/db";

export const getProductById = async (productId: string) => {
  return await db.product.findUnique({
    where: { id: productId },
    include: {
      tissues: true,
      prices: true,

      pricings: {
        include: {
          subtype: true,
        },
      },
    },
  });
};
