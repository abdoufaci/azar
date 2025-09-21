import { create } from "zustand";

export type ModalType =
  | "manageAgency"
  | "manageTravel"
  | "deleteUser"
  | "deleteTravel"
  | "manageReservation"
  | "setAgencyPassword"
  | "deleteReservation";

export interface ModalData {
  isEdit?: boolean;
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
