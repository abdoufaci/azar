import {
  OrderInTable,
  OrderWithRelations,
  ProductInTable,
  SupplyInTable,
  UserInTable,
  UserWithWorkshop,
} from "@/types/types";
import {
  Invoice,
  ProductPrices,
  Supplier,
  Supply,
  Tissu,
  WareHouse,
  WorkShop,
} from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "manageDemand"
  | "manageProduction"
  | "manageWorkShop"
  | "thankyou"
  | "chooseTissu"
  | "acceptOrder"
  | "manageInvoice"
  | "images"
  | "deleteUser"
  | "manageSupply";

export interface ModalData {
  isEdit?: boolean;
  employees?: UserWithWorkshop[];
  product?: ProductInTable;
  tissues?: Tissu[];
  workShops?: WorkShop[];
  order?: OrderInTable;
  productions?: OrderWithRelations[] | OrderInTable[];
  user?: UserInTable;
  invoice?: Invoice;
  date?: Date;
  images?: { type: string; id: string }[];
  onDeleteUser?: () => void;
  onUpdateOrderStatus?: () => void;
  suppliers?: Supplier[];
  warehouses?: WareHouse[];
  onAddSupply?: (item: SupplyInTable) => void;
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
