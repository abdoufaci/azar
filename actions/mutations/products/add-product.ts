"use server";

import { checkIsAdmin } from "@/actions/security/admin-check";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductFormData } from "@/schemas/product-schema";
import { ProductAudience } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addProduct = async ({
  audience,
  data,
}: {
  data: ProductFormData;
  audience: ProductAudience;
}) => {
  await checkIsAdmin();
  const user = await currentUser();

  await db.product.create({
    data: {
      arDescription: data.descriptionAr,
      arName: data.nameAr,
      audience,
      category: data.category,
      frDescription: data.descriptionFr,
      frName: data.nameFr,
      mainImageIdx: data.mainImageIdx,
      price: data.price,
      images: data.images,
      variantId: data.variant.id,
      pricingId: data.pricingId,
      userId: user?.id || "",
      ...(!!data.tissues.length && {
        tissues: {
          connect: data.tissues.map((tissu) => ({ id: tissu.id })),
        },
      }),
    },
  });

  revalidatePath("/");
};
