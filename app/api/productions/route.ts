import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductionInTable } from "@/types/types";
import { Cart, CartItem, Product, ProductCategory } from "@prisma/client";
import { NextResponse } from "next/server";

const PRODUCTIONS_BATCH = 8;

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const search = searchParams.get("search");
    const workshop = searchParams.get("workshop");
    const type = searchParams.get("type");
    const variant = searchParams.get("variant");
    const status = searchParams.get("status");

    let productions: ProductionInTable[];

    const baseOrderInclude = {
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
    };
    //@ts-ignore
    productions = await db.order.findMany({
      where: {
        status: "ACCEPTED",
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
        ...(workshop && {
          workShopId: workshop,
        }),
        ...(type && {
          subtypeId: type,
        }),
        ...(variant && {
          variantId: variant,
        }),
        ...(status && {
          orderStageId: status,
        }),
      },
      include: {
        ...baseOrderInclude,
      },
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      take: PRODUCTIONS_BATCH,
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor = null;
    if (productions.length === PRODUCTIONS_BATCH) {
      nextCursor = productions[productions.length - 1].id;
    }

    return NextResponse.json({
      productions,
      nextCursor,
    });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
