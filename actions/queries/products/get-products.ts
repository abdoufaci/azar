import { db } from "@/lib/db";

export const getProducts = async () => {
  const products = await db.product.findMany({
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

  const Bproducts = products.filter((product) => product.audience === "B2B");
  const Cproducts = products.filter((product) => product.audience === "B2C");

  return { Bproducts, Cproducts };
};
