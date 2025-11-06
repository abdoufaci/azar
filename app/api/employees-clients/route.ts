import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const workshopId = searchParams.get("workshopId");

    const users = await db.user.findMany({
      where: {
        role: {
          in: ["CLIENT", "EMPLOYEE"],
        },
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

    const clients = users.filter((user) => user.role === "CLIENT");
    const employees = users.filter((user) => user.role === "EMPLOYEE");
    return NextResponse.json({
      users: { clients, employees },
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
