import { db } from "@/lib/db";
import { ProductionInTable } from "@/types/types";
import { DeskType, StockDisponibility } from "@prisma/client";
import { NextResponse } from "next/server";

const DESKS_BATCH = 8;

export async function GET(req: Request) {
  try {
    let from: Date | null = null;
    let to: Date | null = null;
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    if (dateFrom) {
      from = new Date(dateFrom!);
    }

    if (dateTo) {
      to = new Date(dateTo!);
      to.setDate(to.getDate() + 1);
    }

    const desks = await db.desk.findMany({
      where: {
        ...(from &&
          to && {
            createdAt: {
              gte: from,
              lte: to,
            },
          }),
        ...(type && {
          type: type as DeskType,
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
          ],
        }),
      },
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      take: !!search || cursor || !!search ? 50 : DESKS_BATCH,
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor = null;
    if (desks.length === DESKS_BATCH) {
      nextCursor = desks[desks.length - 1].id;
    }

    return NextResponse.json({
      desks,
      nextCursor,
    });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
