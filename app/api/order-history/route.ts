import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Cart, CartItem } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const orderId = searchParams.get("orderId");

    const history = await db.orderHistory.findMany({
      where: {
        orderId: orderId || "",
      },
      include: {
        employee: true,
        newStage: true,
        oldStage: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({
      history,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
