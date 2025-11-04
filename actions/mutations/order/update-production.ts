"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductionFormData } from "@/schemas/production-schema";
import { ProductionInTable, ProductVariantWithPricing } from "@/types/types";
import { revalidatePath } from "next/cache";

export const updateProduction = async ({
  data,
  productionId,
  oldData,
}: {
  data: ProductionFormData;
  oldData: ProductionFormData;
  productionId?: string;
}) => {
  if (!productionId) {
    throw new Error("Order not found .");
  }
  const user = await currentUser();

  const { variant, category, tissu, ...rest } = data;
  const changes: string[] = [];

  const compareField = (field: keyof ProductionFormData, label: string) => {
    const oldVal = (oldData as any)?.[field];
    const newVal = (data as any)?.[field];
    if (oldVal !== newVal) {
      changes.push(`${label} de "${oldVal ?? "—"}" à "${newVal ?? "—"}"`);
    }
  };

  // Primitive comparisons
  compareField("price", "price");
  compareField("note", "note");
  compareField("subtypeId", "subtype");
  compareField("clientId", "client");
  compareField("workShopId", "workshop");

  // Category
  if (oldData.category !== data.category) {
    changes.push(`la catégorie de "${oldData.category}" à "${data.category}"`);
  }

  // Variant
  if (oldData.variant.id !== data.variant.id) {
    changes.push(
      `la variante de "${oldData.variant.name}" à "${data.variant.name}"`
    );
  }

  // Tissu
  if (oldData.tissu?.id !== data.tissu?.id) {
    changes.push(
      `le tissu de "${oldData.tissu?.name ?? "none"}" à "${
        data.tissu?.name ?? "none"
      }"`
    );
  }

  // Build the final text
  const text =
    changes.length > 0
      ? `a modifié ${changes.join(" et ")}.`
      : "Aucun changement effectué.";

  const order = await db.order.update({
    where: {
      id: productionId,
    },
    data: {
      ...rest,
      tissuId: tissu?.id,
      variantId: data.variant.id,
      status: "ACCEPTED",
      barCode: "",
      history: {
        create: {
          type: "INFORMATION",
          text,
          userId: user?.id || "",
        },
      },
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

  revalidatePath("/");

  return order;
};
