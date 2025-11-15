import { db } from "@/lib/db";
import { ProductionInTable } from "@/types/types";
import { DeskType, StockDisponibility } from "@prisma/client";
import { NextResponse } from "next/server";

const SUPPLIES_BATCH = 8;

export async function GET(req: Request) {
  try {
    let from: Date | null = null;
    let to: Date | null = null;
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const search = searchParams.get("search");
    const supplier = searchParams.get("supplier");
    const warehouse = searchParams.get("warehouse");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    if (dateFrom) {
      from = new Date(dateFrom!);
    }

    if (dateTo) {
      to = new Date(dateTo!);
      to.setDate(to.getDate() + 1);
    }

    const supplies = await db.supply.findMany({
      where: {
        ...(from &&
          to && {
            createdAt: {
              gte: from,
              lte: to,
            },
          }),
        ...(supplier && {
          supplierId: supplier,
        }),
        ...(warehouse && {
          wareHouseId: warehouse,
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
              warehouse: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              supplier: {
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
        products: { include: { type: true } },
        supplier: true,
        warehouse: true,
      },
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      take: !!search || cursor || !!search ? 50 : SUPPLIES_BATCH,
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor = null;
    if (supplies.length === SUPPLIES_BATCH) {
      nextCursor = supplies[supplies.length - 1].id;
    }

    return NextResponse.json({
      supplies,
      nextCursor,
    });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
