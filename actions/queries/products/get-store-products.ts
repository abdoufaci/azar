import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getStoreProducts = async () => {
  const user = await currentUser();

  const salons = await db.product.findMany({
    where: {
      isArchived: false,
      ...(!!user && {
        audience: "B2B",
      }),
      ...(!user && {
        audience: "B2C",
      }),
      category: "SALON",
    },
    take: 4,
    include: {
      tissues: true,
      prices: true,
      pricings: {
        include: {
          subtype: true,
        },
      },
    },
  });

  const tables = await db.product.findMany({
    where: {
      isArchived: false,
      ...(!!user && {
        audience: "B2B",
      }),
      ...(!user && {
        audience: "B2C",
      }),
      category: "TABLE",
    },
    take: 4,
    include: {
      tissues: true,
      prices: true,
      pricings: {
        include: {
          subtype: true,
        },
      },
    },
  });

  const chaires = await db.product.findMany({
    where: {
      isArchived: false,
      ...(!!user && {
        audience: "B2B",
      }),
      ...(!user && {
        audience: "B2C",
      }),
      category: "CHAIR",
    },
    take: 4,
    include: {
      tissues: true,
      prices: true,
      pricings: {
        include: {
          subtype: true,
        },
      },
    },
  });

  return { salons, tables, chaires };
};
