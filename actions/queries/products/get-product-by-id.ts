import { db } from "@/lib/db";

export const getProductById = async (productId: string) => {
  return await db.product.findUnique({
    where: { id: productId },
    include: {
      tissues: true,
      pricing: {
        include: {
          subtype: true,
          variant: true,
        },
      },
    },
  });
};
