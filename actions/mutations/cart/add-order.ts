"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Cart, CartItem, Product, ProductPricing, Tissu } from "@prisma/client";
import ShortUniqueId from "short-unique-id";

export const addOrder = async ({
  cart,
  guest,
}: {
  cart: Cart & {
    items: (CartItem & {
      product: Product & {
        pricing: ProductPricing;
      };
      tissu: Tissu;
    })[];
  };
  guest: {
    name: string;
    wilaya: string;
    phone: string;
    adress: string;
    note: string;
  };
}) => {
  const user = await currentUser();
  let guestId: string | undefined = undefined;

  if (!user) {
    const g = await db.guest.create({
      data: {
        ...guest,
      },
    });
    guestId = g.id;
  }

  await db.$transaction([
    db.order.createMany({
      data: cart.items.flatMap((item) => {
        return Array.from({ length: item.quantity }, () => {
          const uid = new ShortUniqueId({ length: 10 });
          const orderId = uid.rnd();
          return {
            ...(!!user && { clientId: user.id }),
            orderId,
            subtypeId: item.product.pricing.subtypeId,
            variantId: item.product.variantId,
            tissuId: item.tissuId,
            ...(!user && { guestId }),
          };
        });
      }),
    }),
    db.cartItem.deleteMany({
      where: {
        id: { in: cart.items.map((item) => item.id) },
      },
    }),
  ]);
};
