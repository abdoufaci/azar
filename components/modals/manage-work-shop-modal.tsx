"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { useModal } from "@/hooks/use-modal-store";
import { ManageWorkShopForm } from "../forms/manage-work-shop-form";

export const ManageWorkShopModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "manageWorkShop";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black w-full max-w-xl">
        <DialogHeader className="py-2 ">
          <DialogTitle className="text-xl text-[#25201C] font-semibold text-left">
            Ajouter un atelier
          </DialogTitle>
        </DialogHeader>
        <ManageWorkShopForm />
      </DialogContent>
    </Dialog>
  );
};
