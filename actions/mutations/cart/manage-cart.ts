"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductWithPricing } from "@/types/types";

interface Props {
  product: ProductWithPricing;
  cartId?: string | null;
  tissuId?: string;
}

export const manageCart = async ({ product, cartId, tissuId }: Props) => {
  const user = await currentUser();

  try {
    // If logged-in user
    if (user) {
      const existingCart = await db.cart.findFirst({
        where: { userId: user.id },
        select: { id: true },
      });

      // If cart exists → add item
      if (existingCart) {
        const item = await db.cartItem.create({
          data: {
            productId: product.id,
            cartId: existingCart.id,
            tissuId: tissuId ?? product.tissues?.[0]?.id ?? null,
          },
        });
        return { status: "added_to_existing_cart", item };
      }

      // Else → create a new cart with one item
      const newCart = await db.cart.create({
        data: {
          userId: user.id,
          items: {
            create: {
              productId: product.id,
              tissuId: tissuId ?? product.tissues?.[0]?.id ?? null,
            },
          },
        },
      });

      return { status: "new_cart_created", cart: newCart };
    }

    // Guest user
    if (cartId) {
      const item = await db.cartItem.create({
        data: {
          productId: product.id,
          cartId,
          tissuId: tissuId ?? product.tissues?.[0]?.id ?? null,
        },
      });
      return { status: "added_to_guest_cart", item };
    }

    // Guest user with no cart → create new one
    const newGuestCart = await db.cart.create({
      data: {
        items: {
          create: {
            productId: product.id,
            tissuId: tissuId ?? product.tissues?.[0]?.id ?? null,
          },
        },
      },
    });

    return { status: "guest_cart_created", cart: newGuestCart };
  } catch (error) {
    console.error("❌ Error managing cart:", error);
    throw new Error("Failed to manage cart");
  }
};
