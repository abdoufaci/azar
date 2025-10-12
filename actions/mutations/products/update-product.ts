"use server";

import { deleteEverythingFile } from "@/actions/mutations/videos/delete-everthing-file";
import { checkIsAdmin } from "@/actions/security/admin-check";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductFormData } from "@/schemas/product-schema";
import { ProductAudience } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateProduct = async ({
  productId,
  data,
  imagesToDelete,
  tissuesToRemove,
}: {
  data: ProductFormData;
  productId?: string;
  imagesToDelete: {
    id: string;
    type: string;
  }[];
  tissuesToRemove: {
    id: string;
    name: string;
  }[];
}) => {
  await checkIsAdmin();
  const user = await currentUser();

  if (!productId) {
    throw new Error("Product not found");
  }

  if (!!imagesToDelete.length) {
    imagesToDelete.map(async (image) => {
      await deleteEverythingFile(image);
    });
  }

  await db.product.update({
    where: {
      id: productId,
    },
    data: {
      arDescription: data.descriptionAr,
      arName: data.nameAr,
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
      ...(!!tissuesToRemove.length && {
        tissues: {
          disconnect: tissuesToRemove.map((tissu) => ({ id: tissu.id })),
        },
      }),
    },
  });

  revalidatePath("/");
};
