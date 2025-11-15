import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const productions = await db.order.findMany({
      where: {
        status: "ACCEPTED",
        orderStage: {
          name: "Fini",
        },
        clientId: null,
        guestId: null,
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
        user: true,
        variant: true,
        workShop: true,
        guest: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      productions,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
