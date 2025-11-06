import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const orderId = searchParams.get("orderId");

    const order = await db.order.findUnique({
      where: {
        id: orderId || "",
      },
      include: {
        client: true,
        tissu: true,
        orderStage: true,
        pricing: true,
        subType: true,
        cutter: true,
        tailor: true,
        tapisier: true,
        mancheur: true,
        user: true,
        variant: true,
        workShop: true,
        guest: true,
        extraCells: {
          include: {
            person: true,
            status: true,
          },
        },
      },
    });
    return NextResponse.json({
      order,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
