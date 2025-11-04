"use client";

import { ProductionInTable } from "@/types/types";
import { EmplyeeRole, OrderStage, User } from "@prisma/client";

export type OptimisticAction =
  | { type: "ADD"; item: ProductionInTable }
  | { type: "DELETE"; id: string }
  | { type: "updateStage"; stage: OrderStage; idx: number }
  | { type: "updateProduction"; production: ProductionInTable }
  | {
      type: "addEmployee";
      idx: number;
      employee: User;
      role: EmplyeeRole;
      action: "add" | "remove";
    };

export const productionOptimisticReducer = (
  state: ProductionInTable[],
  action: OptimisticAction
): ProductionInTable[] => {
  switch (action.type) {
    case "ADD":
      return [action.item, ...state];
    case "DELETE":
      // Filter out the item being deleted
      return state.filter((item) => item.id !== action.id);
    case "updateStage":
      let curr = state;
      curr[action.idx].orderStage = {
        ...action.stage,
      };
      curr[action.idx].orderStageId = action.stage.id;

      return curr;
    case "updateProduction":
      let current = state;
      const idx = current.findIndex((item) => item.id === action.production.id);
      current[idx] = {
        ...action.production,
      };
      return current;
    case "addEmployee":
      let currentState = state;
      if (action.role === "CUTTER") {
        currentState[action.idx].cutter =
          action.action === "add"
            ? {
                ...action.employee,
              }
            : null;
        currentState[action.idx].cutterId =
          action.action === "add" ? action.employee.id : null;
      }
      if (action.role === "MANCHEUR") {
        currentState[action.idx].mancheur =
          action.action === "add"
            ? {
                ...action.employee,
              }
            : null;
        currentState[action.idx].mancheurId =
          action.action === "add" ? action.employee.id : null;
      }
      if (action.role === "TAILOR") {
        currentState[action.idx].tailor =
          action.action === "add"
            ? {
                ...action.employee,
              }
            : null;
        currentState[action.idx].tailorId =
          action.action === "add" ? action.employee.id : null;
      }
      if (action.role === "TAPISIER") {
        currentState[action.idx].tapisier =
          action.action === "add"
            ? {
                ...action.employee,
              }
            : null;
        currentState[action.idx].tapisierId =
          action.action === "add" ? action.employee.id : null;
      }

      return currentState;
    default:
      return state;
  }
};
