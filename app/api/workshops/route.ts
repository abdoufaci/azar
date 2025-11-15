import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const isWorkshopPage = searchParams.get("isWorkshopPage");
    const workshops = await db.workShop.findMany({
      ...(!!isWorkshopPage && {
        include: {
          demands: true,
          orders: {
            include: {
              orderStage: true,
            },
          },
        },
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      workshops,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
