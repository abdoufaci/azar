import { db } from "@/lib/db";
import { ProductionInTable } from "@/types/types";
import { NextResponse } from "next/server";

const ORDERS_BATCH = 8;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const search = searchParams.get("search");
    const target = searchParams.get("target");
    const type = searchParams.get("type");
    const variant = searchParams.get("variant");

    const orders = await db.order.findMany({
      where: {
        ...(target === "B2B" && {
          clientId: {
            not: null,
          },
        }),
        ...(target === "B2C" && {
          guestId: {
            not: null,
          },
        }),
        ...(search && {
          OR: [
            {
              orderId: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              client: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              client: {
                username: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              user: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              user: {
                username: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              tissu: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        }),
        ...(type && {
          subtypeId: type,
        }),
        ...(variant && {
          variantId: variant,
        }),
      },
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      include: {
        client: true,
        tissu: true,
        subType: true,
        user: true,
        variant: true,
        guest: true,
      },
      take:
        !!search || cursor || !!search || !!type || !!variant
          ? 50
          : ORDERS_BATCH,
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor = null;
    if (orders.length === ORDERS_BATCH) {
      nextCursor = orders[orders.length - 1].id;
    }

    return NextResponse.json({
      orders,
      nextCursor,
    });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
