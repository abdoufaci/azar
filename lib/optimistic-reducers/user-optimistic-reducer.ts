"use client";

import { UserInTable } from "@/types/types";
import { EmplyeeRole, OrderStage, User } from "@prisma/client";

type OptimisticAction =
  | { type: "ADD"; item: UserInTable }
  | { type: "DELETE"; id: string }
  | { type: "updateUser"; user: UserInTable };

export const userOptimisticReducer = (
  state: UserInTable[],
  action: OptimisticAction
): UserInTable[] => {
  switch (action.type) {
    case "ADD":
      return [action.item, ...state];
    case "DELETE":
      // Filter out the item being deleted
      return state.filter((item) => item.id !== action.id);
    case "updateUser":
      let current = state;
      const idx = current.findIndex((item) => item.id === action.user.id);
      current[idx] = {
        ...action.user,
      };
      return current;
    default:
      return state;
  }
};
