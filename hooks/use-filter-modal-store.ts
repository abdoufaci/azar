import { create } from "zustand";

export interface AdminData {
  search?: string;
  type?: string;
  variant?: string;
  workshop?: string;
  status?: string;
}

export interface SupplyData {
  supplier?: string;
}

export interface DeskData {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface StockData {
  warehouse?: string;
  disponibility?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface DemandData {
  material?: string;
  priority?: string;
}

export interface StoreData {
  price?: {
    min: number;
    max: number;
  };
  search?: string;
  subtypeId?: string;
  variantId?: string;
}

interface ModalStore {
  onSearch: ({}: {
    store?: StoreData;
    admin?: AdminData;
    demand?: DemandData;
    stock?: StockData;
    desk?: DeskData;
    supply?: SupplyData;
  }) => void;
  store: StoreData;
  admin: AdminData;
  demand: DemandData;
  stock: StockData;
  desk: DeskData;
  supply: SupplyData;
}

export const useFilterModal = create<ModalStore>((set) => ({
  store: {},
  production: {},
  admin: {},
  demand: {},
  stock: {},
  desk: {},
  supply: {},
  onSearch: ({
    store = {},
    admin = {},
    demand = {},
    stock = {},
    desk = {},
    supply = {},
  }) => set({ store, admin, demand, stock, desk, supply }),
}));
