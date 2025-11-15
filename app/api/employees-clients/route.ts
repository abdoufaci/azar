import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const workshopId = searchParams.get("workshopId");
    const target = searchParams.get("target");
    const includeAdmin = searchParams.get("includeAdmin");

    const users = await db.user.findMany({
      where: {
        role:
          target === "client"
            ? "CLIENT"
            : includeAdmin === "true"
            ? {
                in: ["ADMIN", "EMPLOYEE"],
              }
            : "EMPLOYEE",
        ...(workshopId && {
          workShopId: workshopId,
        }),
      },
      include: {
        invoices: true,
        workShop: true,
        cutterOrders: {
          include: {
            variant: true,
            subType: true,
            pricing: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        tailorOrders: {
          include: {
            variant: true,
            subType: true,
            pricing: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        tapisierOrders: {
          include: {
            variant: true,
            subType: true,
            pricing: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        mancheurOrders: {
          include: {
            variant: true,
            subType: true,
            pricing: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      users,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
