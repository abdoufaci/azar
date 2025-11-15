"use client";

import { OrderInTable } from "@/types/types";
import { OrderStatus } from "@prisma/client";

type OptimisticAction =
  | { type: "ADD"; item: OrderInTable }
  | { type: "DELETE"; id: string }
  | { type: "UPDATE"; user: OrderInTable }
  | { type: "updateStatus"; idx: number; status: OrderStatus };

export const orderOptimisticReducer = (
  state: OrderInTable[],
  action: OptimisticAction
): OrderInTable[] => {
  switch (action.type) {
    case "ADD":
      return [action.item, ...state];
    case "DELETE":
      // Filter out the item being deleted
      return state.filter((item) => item.id !== action.id);
    case "UPDATE":
      let current = state;
      const idx = current.findIndex((item) => item.id === action.user.id);
      current[idx] = {
        ...action.user,
      };
      return current;
    case "updateStatus":
      let curr = state;
      curr[action.idx].status = action.status;
      return curr;
    default:
      return state;
  }
};
