import { db } from "@/lib/db";

export const getColumns = async () => {
  return await db.orderColumn.findMany({
    include: {
      statuses: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
