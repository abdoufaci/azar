import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const suppliers = await db.supplier.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      suppliers,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
