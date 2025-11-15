import { db } from "@/lib/db";
import { ProductionInTable } from "@/types/types";
import { StockDisponibility } from "@prisma/client";
import { NextResponse } from "next/server";

const STOCKS_BATCH = 8;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const warehouse = searchParams.get("warehouse");
    const disponibility = searchParams.get("disponibility");

    const stocks = await db.stock.findMany({
      where: {
        ...(warehouse && {
          wareHouseId: warehouse,
        }),
        ...(type && {
          typeId: type,
        }),
        ...(disponibility && {
          disponibility: disponibility as StockDisponibility,
        }),
        ...(search && {
          OR: [
            {
              ref: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              type: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        }),
      },
      include: {
        type: true,
        wareHouse: true,
      },
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      take: !!search || cursor || !!search ? 50 : STOCKS_BATCH,
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor = null;
    if (stocks.length === STOCKS_BATCH) {
      nextCursor = stocks[stocks.length - 1].id;
    }

    return NextResponse.json({
      stocks,
      nextCursor,
    });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
