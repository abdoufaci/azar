import { create } from "zustand";

export interface AdminData {
  search?: string;
  type?: string;
  variant?: string;
  workshop?: string;
  status?: string;
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
  }) => void;
  store: StoreData;
  admin: AdminData;
  demand: DemandData;
}

export const useFilterModal = create<ModalStore>((set) => ({
  store: {},
  production: {},
  admin: {},
  demand: {},
  onSearch: ({ store = {}, admin = {}, demand = {} }) =>
    set({ store, admin, demand }),
}));
