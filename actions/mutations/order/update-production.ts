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
      changes.push(`${label} from "${oldVal ?? "—"}" to "${newVal ?? "—"}"`);
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
    changes.push(`category from "${oldData.category}" to "${data.category}"`);
  }

  // Variant
  if (oldData.variant.id !== data.variant.id) {
    changes.push(
      `variant from "${oldData.variant.name}" (${oldData.variant.color}) to "${data.variant.name}" (${data.variant.color})`
    );
  }

  // Tissu
  if (oldData.tissu?.id !== data.tissu?.id) {
    changes.push(
      `tissu from "${oldData.tissu?.name ?? "none"}" to "${
        data.tissu?.name ?? "none"
      }"`
    );
  }

  // Build the final text
  const text =
    changes.length > 0
      ? `changed ${changes.join(" and ")}.`
      : "No changes made.";

  await db.order.update({
    where: {
      id: productionId,
    },
    data: {
      ...rest,
      tissuId: tissu?.id,
      variantId: data.variant.id,
      status: "ACCEPTED",
      acceptedAt: new Date(),
      barCode: "",
      history: {
        create: {
          type: "INFORMATION",
          text,
          userId: user?.id || "",
        },
      },
    },
  });

  revalidatePath("/");
};
