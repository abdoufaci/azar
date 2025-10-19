import { create } from "zustand";

export interface ModalData {
  price?: {
    min: number;
    max: number;
  };
  search?: string;
  subtypeId?: string;
  variantId?: string;
}

interface ModalStore {
  onSearch: (data?: ModalData) => void;
  data: ModalData;
}

export const useFilterModal = create<ModalStore>((set) => ({
  data: {},
  onSearch: (data) => set({ data }),
}));
