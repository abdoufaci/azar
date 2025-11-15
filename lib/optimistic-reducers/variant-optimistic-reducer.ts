"use client";

import { ProductVariantWithPricing } from "@/types/types";
import { EmplyeeRole, OrderStage, User } from "@prisma/client";

type OptimisticAction =
  | { type: "add"; incoming: ProductVariantWithPricing }
  | { type: "update"; updatedState: ProductVariantWithPricing[] };

export const variantOptimisticReducer = (
  state: ProductVariantWithPricing[],
  action: OptimisticAction
): ProductVariantWithPricing[] => {
  switch (action.type) {
    case "add":
      return [action.incoming, ...state];
    case "update":
      return action.updatedState;
    default:
      return state;
  }
};
