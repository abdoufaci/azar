import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getStoreProducts = async () => {
  const user = await currentUser();

  const products = await db.product.findMany({
    where: {
      ...(!!user && {
        audience: "B2B",
      }),
      ...(!user && {
        audience: "B2C",
      }),
    },
    include: {
      tissues: true,
    },
  });

  return products;
};
