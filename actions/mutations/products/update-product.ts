"use server";

import { deleteEverythingFile } from "@/actions/mutations/videos/delete-everthing-file";
import { checkIsAdmin } from "@/actions/security/admin-check";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductFormData } from "@/schemas/product-schema";
import { ProductPrices, ProductPricing, ProductSubtype } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateProduct = async ({
  productId,
  data,
  imagesToDelete,
  tissuesToRemove,
  pricings,
  currentPricings,
  currentPrices,
  prices,
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
  pricings: (ProductPricing & {
    subtype: ProductSubtype;
  })[];
  currentPricings: (ProductPricing & {
    subtype: ProductSubtype;
  })[];
  prices: {
    price: number;
    typeId: string;
    id?: string | undefined;
  }[];
  currentPrices: ProductPrices[];
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

  const pricesToUpdate = prices.filter((price) => price.id);
  const pricesToCreate = prices.filter((price) => !price.id);
  const pricesToDelete = currentPrices
    .filter((pricing) => !prices.find((price) => price.id === pricing.id))
    .map((pricing) => pricing.id);

  const product = await db.product.update({
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
      images: data.images,
      variantId: data.variant.id,
      prices: {
        ...(!!pricesToUpdate.length && {
          updateMany: pricesToUpdate.map((price) => ({
            where: { id: price.id },
            data: {
              price: price.price,
              typeId: price.typeId,
            },
          })),
        }),
        ...(!!pricesToCreate.length && {
          createMany: { data: pricesToCreate },
        }),
        ...(!!pricesToDelete.length && {
          deleteMany: {
            id: {
              in: pricesToDelete,
            },
          },
        }),
      },
      pricings: {
        disconnect: currentPricings.map(({ id }) => ({ id })),
        connect: pricings.map(({ id }) => ({ id })),
      },
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
