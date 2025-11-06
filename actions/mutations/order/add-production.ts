"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductionFormData } from "@/schemas/production-schema";
import { ProductionInTable, ProductVariantWithPricing } from "@/types/types";
import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";

export const addProduction = async ({
  data,
  selectedVariant,
  subOrderId,
}: {
  data: ProductionFormData;
  selectedVariant?: ProductVariantWithPricing;
  subOrderId?: string;
}) => {
  const user = await currentUser();

  const { variant, category, tissu, ...rest } = data;

  const pricing = selectedVariant?.pricings.find(
    (pricing) => pricing.subtypeId === data.subtypeId
  );

  const id = createId();

  await db.orderPricing.create({
    data: {
      cutterPrice: pricing?.cutterPrice || 0,
      tailorPrice: pricing?.tailorPrice || 0,
      tapisierPrice: pricing?.tapisierPrice || 0,
      mancheurPrice: pricing?.mancheurPrice || 0,
      orders: {
        create: {
          ...rest,
          id,
          tissuId: tissu?.id,
          userId: user?.id || "",
          variantId: data.variant.id,
          status: "ACCEPTED",
          orderId: "/",
          acceptedAt: new Date(),
          barCode: "",
          orderStageId: "cmgfnausl0000kpfk6hf6653l",
          ...(subOrderId && {
            subOrderId,
          }),
        },
      },
    },
  });

  const order = await db.order.findUnique({
    where: {
      id,
    },
    include: {
      client: true,
      tissu: true,
      orderStage: true,
      pricing: true,
      subType: true,
      cutter: true,
      tailor: true,
      tapisier: true,
      mancheur: true,
      user: true,
      variant: true,
      workShop: true,
      guest: true,
      extraCells: {
        include: {
          person: true,
          status: true,
        },
      },
    },
  });

  revalidatePath("/");

  return order;
};
