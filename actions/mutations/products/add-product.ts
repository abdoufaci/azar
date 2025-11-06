"use server";

import { checkIsAdmin } from "@/actions/security/admin-check";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductFormData } from "@/schemas/product-schema";
import {
  ProductAudience,
  ProductPricing,
  ProductSubtype,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addProduct = async ({
  audience,
  data,
  pricings,
  prices,
}: {
  data: ProductFormData;
  audience: ProductAudience;
  pricings: (ProductPricing & {
    subtype: ProductSubtype;
  })[];
  prices: {
    price: number;
    typeId: string;
    id?: string;
  }[];
}) => {
  await checkIsAdmin();
  const user = await currentUser();

  const product = await db.product.create({
    data: {
      arDescription: data.descriptionAr,
      arName: data.nameAr,
      audience,
      category: data.category,
      frDescription: data.descriptionFr,
      frName: data.nameFr,
      mainImageIdx: data.mainImageIdx,

      images: data.images,
      variantId: data.variant.id,
      pricings: {
        connect: pricings.map(({ id }) => ({ id })),
      },
      prices: {
        createMany: {
          data: prices.map((price) => ({
            price: price.price,
            typeId: price.typeId,
          })),
        },
      },
      userId: user?.id || "",
      ...(!!data.tissues.length && {
        tissues: {
          connect: data.tissues.map((tissu) => ({ id: tissu.id })),
        },
      }),
    },
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

  revalidatePath("/");

  return product;
};
