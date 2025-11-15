"use client";

import { Desk } from "@prisma/client";

type OptimisticAction =
  | { type: "ADD"; item: Desk }
  | { type: "DELETE"; id: string }
  | { type: "UPDATE"; desk: Desk };

export const deskOptimisticReducer = (
  state: Desk[],
  action: OptimisticAction
): Desk[] => {
  switch (action.type) {
    case "ADD":
      return [action.item, ...state];
    case "DELETE":
      // Filter out the item being deleted
      return state.filter((item) => item.id !== action.id);
    case "UPDATE":
      let current = state;
      const idx = current.findIndex((item) => item.id === action.desk.id);
      current[idx] = {
        ...action.desk,
      };
      return current;
    default:
      return state;
  }
};
