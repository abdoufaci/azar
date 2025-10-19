import { db } from "@/lib/db";

export const getAvailableProductions = async () => {
  return await db.order.findMany({
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
};
