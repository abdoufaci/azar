import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Cart, CartItem } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const demandId = searchParams.get("demandId");

    const history = await db.demandHistory.findMany({
      where: {
        demandId: demandId || "",
      },
      include: {
        user: true,
        newStage: true,
        oldStage: true,
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
