import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const warehouses = await db.wareHouse.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      warehouses,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
