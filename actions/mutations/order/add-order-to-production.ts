"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderInTable } from "@/types/types";
import { revalidatePath } from "next/cache";

export const addOrderToProduction = async ({
  order,
  price,
  workShopId,
}: {
  order: OrderInTable;
  price: number;
  workShopId: string;
}) => {
  const user = await currentUser();

  const pricing = await db.productPricing.findFirst({
    where: {
      variantId: order.variantId,
      subtypeId: order.subtypeId,
    },
  });

  await db.$transaction([
    db.orderPricing.create({
      data: {
        cutterPrice: pricing?.cutterPrice || 0,
        tailorPrice: pricing?.tailorPrice || 0,
        tapisierPrice: pricing?.tapisierPrice || 0,
        mancheurPrice: pricing?.mancheurPrice || 0,
        orders: {
          connect: { id: order.id },
        },
      },
    }),
    db.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "ACCEPTED",
        workShopId,
        price: price,
        acceptedAt: new Date(),
        orderStageId: "cmgfnausl0000kpfk6hf6653l",
        userId: user?.id || "",
      },
    }),
  ]);

  revalidatePath("/");
};
