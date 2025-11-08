import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Cart, CartItem, Product, ProductCategory } from "@prisma/client";
import { NextResponse } from "next/server";

const PRODUCTS_BATCH = 12;

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const search = searchParams.get("search");
    const variantId = searchParams.get("variantId");
    const subtypeId = searchParams.get("subtypeId");
    const type = searchParams.get("type");

    let products: Product[];

    if (cursor) {
      products = await db.product.findMany({
        where: {
          isArchived: false,
          category: type as ProductCategory,
          audience: !!user ? "B2B" : "B2C",
          ...(subtypeId && {
            pricing: {
              subtypeId,
            },
          }),
          ...(variantId && {
            variantId,
          }),
          ...(min &&
            max && {
              price: {
                gte: Number(min),
                lte: Number(max),
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
        },
        skip: 1,
        cursor: {
          id: cursor,
        },
        take:
          search === "" && !min && !max && !variantId && !subtypeId
            ? PRODUCTS_BATCH
            : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      products = await db.product.findMany({
        where: {
          category: type as ProductCategory,
          audience: !!user ? "B2B" : "B2C",
          ...(subtypeId && {
            pricing: {
              subtypeId,
            },
          }),
          ...(variantId && {
            variantId,
          }),
          ...(min &&
            max && {
              price: {
                gte: Number(min),
                lte: Number(max),
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
        },
        orderBy: {
          createdAt: "desc",
        },
        take:
          search === "" && !min && !max && !variantId && !subtypeId
            ? PRODUCTS_BATCH
            : undefined,
      });
    }

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
