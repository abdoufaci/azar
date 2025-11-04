import { create } from "zustand";

export interface AdminData {
  search?: string;
  type?: string;
  variant?: string;
  workshop?: string;
  status?: string;
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

export interface ModalData {
  store: StoreData;
  admin: AdminData;
}

interface ModalStore {
  onSearch: (data?: ModalData) => void;
  data: ModalData;
}

export const useFilterModal = create<ModalStore>((set) => ({
  data: { store: {}, admin: {} },
  onSearch: (data) => set({ data }),
}));
