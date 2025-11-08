import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Cart,
  CartItem,
  Product,
  ProductAudience,
  ProductCategory,
  ProductPrices,
  ProductPricing,
  ProductSubtype,
  Tissu,
} from "@prisma/client";
import { NextResponse } from "next/server";

const PRODUCTS_BATCH = 12;

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const search = searchParams.get("search");
    const audience = searchParams.get("audience");
    const type = searchParams.get("type");
    const variant = searchParams.get("variant");
    const isArchive = searchParams.get("isArchive");

    let products: (Product & {
      tissues: Tissu[];
      prices: ProductPrices[];
      pricings: (ProductPricing & {
        subtype: ProductSubtype;
      })[];
    })[];

    products = await db.product.findMany({
      where: {
        isArchived: isArchive === "true",
        audience: audience as ProductAudience,
        ...(variant && {
          variantId: variant,
        }),
        ...(type && {
          pricings: {
            some: {
              subtypeId: type,
            },
          },
        }),
        ...(search && {
          OR: [
            {
              arName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              frName: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
      include: {
        tissues: true,
        prices: true,
        pricings: {
          include: {
            subtype: true,
          },
        },
      },
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      take: search === "" ? PRODUCTS_BATCH : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor = null;
    if (products.length === PRODUCTS_BATCH) {
      nextCursor = products[products.length - 1].id;
    }

    return NextResponse.json({
      products,
      nextCursor,
    });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
