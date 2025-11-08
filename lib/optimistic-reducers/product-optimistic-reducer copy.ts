"use client";

import { ProductInTable } from "@/types/types";

type OptimisticAction =
  | { type: "ADD"; item: ProductInTable }
  | { type: "DELETE"; id: string }
  | { type: "updateProduct"; product: ProductInTable };

export const productOptimisticReducer = (
  state: ProductInTable[],
  action: OptimisticAction
): ProductInTable[] => {
  switch (action.type) {
    case "ADD":
      return [action.item, ...state];
    case "DELETE":
      // Filter out the item being deleted
      return state.filter((item) => item.id !== action.id);
    case "updateProduct":
      let current = state;
      const idx = current.findIndex((item) => item.id === action.product.id);
      current[idx] = {
        ...action.product,
      };
      return current;
    default:
      return state;
  }
};
