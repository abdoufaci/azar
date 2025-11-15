"use client";

import { StockInTable } from "@/types/types";
import { StockDisponibility } from "@prisma/client";

type OptimisticAction =
  | { type: "ADD"; item: StockInTable }
  | { type: "DELETE"; id: string }
  | { type: "UPDATE"; stock: StockInTable; idx: number }
  | { type: "updateQty"; quantity: number; idx: number }
  | {
      type: "updateDisponibility";
      disponibility: StockDisponibility;
      idx: number;
    };

export const stockOptimisticReducer = (
  state: StockInTable[],
  action: OptimisticAction
): StockInTable[] => {
  switch (action.type) {
    case "ADD":
      return [action.item, ...state];
    case "DELETE":
      // Filter out the item being deleted
      return state.filter((item) => item.id !== action.id);
    case "UPDATE":
      let current = state;
      current[action.idx] = {
        ...action.stock,
      };
      return current;
    case "updateQty":
      let curr = state;
      curr[action.idx].quantity = action.quantity;
      return curr;
    case "updateDisponibility":
      let cur = state;
      cur[action.idx].disponibility = action.disponibility;
      return cur;
    default:
      return state;
  }
};
