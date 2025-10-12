"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductionFormData } from "@/schemas/production-schema";
import { ProductionInTable, ProductVariantWithPricing } from "@/types/types";
import { revalidatePath } from "next/cache";
import ShortUniqueId from "short-unique-id";

export const addProduction = async ({
  data,
  selectedVariant,
}: {
  data: ProductionFormData;
  selectedVariant?: ProductVariantWithPricing;
}) => {
  const user = await currentUser();

  const { variant, category, tissu, ...rest } = data;

  const pricing = selectedVariant?.pricings.find(
    (pricing) => pricing.subtypeId === data.subtypeId
  );
  const uid = new ShortUniqueId({ length: 10 });

  const orderId = uid.rnd();

  await db.orderPricing.create({
    data: {
      cutterPrice: pricing?.cutterPrice || 0,
      tailorPrice: pricing?.tailorPrice || 0,
      tapisierPrice: pricing?.tapisierPrice || 0,
      orders: {
        create: {
          ...rest,
          tissuId: tissu?.id,
          userId: user?.id || "",
          variantId: data.variant.id,
          status: "ACCEPTED",
          orderId,
          acceptedAt: new Date(),
          barCode: "",
          orderStageId: "cmgfnausl0000kpfk6hf6653l",
        },
      },
    },
  });

  revalidatePath("/");
};
