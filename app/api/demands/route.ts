import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DemandInTable, ProductionInTable } from "@/types/types";
import {
  Cart,
  CartItem,
  DemandPriority,
  Product,
  ProductCategory,
} from "@prisma/client";
import { NextResponse } from "next/server";

const DEMANDS_BATCH = 8;

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const search = searchParams.get("search");
    const workshop = searchParams.get("workshop");
    const material = searchParams.get("material");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    let demands: DemandInTable[];

    demands = await db.demand.findMany({
      where: {
        ...(search && {
          OR: [
            {
              demandId: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              demand: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              material: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              workshop: {
                name: {
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
          ],
        }),
        ...(workshop && {
          workShopId: workshop,
        }),
        ...(status && {
          stageId: status,
        }),
        ...(material && {
          materialId: material,
        }),
        ...(priority && {
          priority: priority as DemandPriority,
        }),
      },
      include: {
        material: true,
        stage: true,
        workshop: true,
        user: true,
      },
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      take: !!search || cursor || !!search || !!workshop ? 50 : DEMANDS_BATCH,
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor = null;
    if (demands.length === DEMANDS_BATCH) {
      nextCursor = demands[demands.length - 1].id;
    }

    return NextResponse.json({
      demands,
      nextCursor,
    });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
