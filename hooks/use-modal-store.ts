import { ProductWithPricing, UserWithWorkshop } from "@/types/types";
import { Tissu } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "manageDemand"
  | "manageProduction"
  | "manageWorkShop"
  | "thankyou"
  | "chooseTissu";

export interface ModalData {
  isEdit?: boolean;
  employees?: UserWithWorkshop[];
  product?: ProductWithPricing;
  tissues?: Tissu[];
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, data: {}, isOpen: false }),
}));
