import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Cart, CartItem } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const cartId = searchParams.get("cart_Id");

    const cart = await db.cart.findFirst({
      where: {
        ...(!!user && {
          userId: user.id || "",
        }),
        ...(cartId &&
          !user && {
            id: cartId,
          }),
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                pricing: true,
              },
            },
            tissu: true,
          },
        },
      },
    });
    return NextResponse.json({
      cart,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
