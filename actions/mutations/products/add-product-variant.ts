"use server";

import { db } from "@/lib/db";
import { ProductCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addProductVariant = async ({
  category,
  name,
  prices,
}: {
  name: string;
  category: ProductCategory;
  prices: {
    id?: string;
    type: {
      id: string;
      name: string;
    };
    cutterPrice: number;
    tailorPrice: number;
    tapisierPrice: number;
    mancheurPrice: number;
  }[];
}) => {
  var randomColor = require("randomcolor"); // import the script
  var color = randomColor();

  await db.productVariant.create({
    data: {
      name,
      category,
      color,
      pricings: {
        createMany: {
          data: prices.map((price) => ({
            cutterPrice: price.cutterPrice,
            subtypeId: price.type.id,
            tailorPrice: price.tailorPrice,
            tapisierPrice: price.tapisierPrice,
            mancheurPrice: price.mancheurPrice,
          })),
        },
      },
    },
  });

  revalidatePath("/");
};
