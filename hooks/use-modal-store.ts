import {
  OrderInTable,
  OrderWithRelations,
  ProductionInTable,
  ProductWithPricing,
  UserInTable,
  UserWithWorkshop,
} from "@/types/types";
import { Invoice, Tissu, WorkShop } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "manageDemand"
  | "manageProduction"
  | "manageWorkShop"
  | "thankyou"
  | "chooseTissu"
  | "acceptOrder"
  | "manageInvoice";

export interface ModalData {
  isEdit?: boolean;
  employees?: UserWithWorkshop[];
  product?: ProductWithPricing;
  tissues?: Tissu[];
  workShops?: WorkShop[];
  order?: OrderInTable;
  productions?: OrderWithRelations[] | OrderInTable[];
  user?: UserInTable;
  invoice?: Invoice;
  date?: Date;
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
