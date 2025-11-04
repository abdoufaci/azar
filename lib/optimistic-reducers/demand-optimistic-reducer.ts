"use client";

import { DemandInTable } from "@/types/types";
import { EmplyeeRole, OrderStage, User } from "@prisma/client";

export type OptimisticAction =
  | { type: "ADD"; item: DemandInTable }
  | { type: "DELETE"; id: string }
  | { type: "updateStage"; stage: OrderStage; idx: number }
  | { type: "updateDemand"; production: DemandInTable };

export const demandOptimisticReducer = (
  state: DemandInTable[],
  action: OptimisticAction
): DemandInTable[] => {
  switch (action.type) {
    case "ADD":
      return [action.item, ...state];
    case "DELETE":
      // Filter out the item being deleted
      return state.filter((item) => item.id !== action.id);
    case "updateStage":
      let curr = state;
      curr[action.idx].stage = {
        ...action.stage,
      };
      curr[action.idx].stageId = action.stage.id;

      return curr;
    case "updateDemand":
      let current = state;
      const idx = current.findIndex((item) => item.id === action.production.id);
      current[idx] = {
        ...action.production,
      };
      return current;
    default:
      return state;
  }
};
