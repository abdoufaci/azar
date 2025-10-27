"use server";

import { db } from "@/lib/db";
import { ProductVariantWithPricing } from "@/types/types";
import { revalidatePath } from "next/cache";

export const updateProductVariant = async ({
  name,
  prices,
  variant,
}: {
  name: string;
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
  variant: ProductVariantWithPricing;
}) => {
  const pricingsToUpdate = prices.filter((price) => price.id);
  const pricingsToCreate = prices.filter((price) => !price.id);
  const pricingsToDelete = variant.pricings
    .filter((pricing) => !prices.find((price) => price.id === pricing.id))
    .map((pricing) => pricing.id);

  await db.$transaction([
    db.productVariant.update({
      where: { id: variant.id },
      data: { name },
    }),
    ...pricingsToUpdate.map((price) =>
      db.productPricing.update({
        where: { id: price.id! },
        data: {
          cutterPrice: price.cutterPrice,
          tailorPrice: price.tailorPrice,
          tapisierPrice: price.tapisierPrice,
          mancheurPrice: price.mancheurPrice,
        },
      })
    ),
    db.productPricing.createMany({
      data: pricingsToCreate.map((price) => ({
        cutterPrice: price.cutterPrice,
        tailorPrice: price.tailorPrice,
        tapisierPrice: price.tapisierPrice,
        mancheurPrice: price.mancheurPrice,
        subtypeId: price.type.id,
        variantId: variant.id,
      })),
    }),
    ...pricingsToDelete.map((id) =>
      db.productPricing.delete({
        where: { id },
      })
    ),
  ]);

  revalidatePath("/");
};
