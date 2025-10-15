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
import { AcceptOrderForm } from "../forms/accept-order-form";

export const AcceptOrderModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "acceptOrder";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black w-full max-w-md">
        <DialogHeader className="py-2 ">
          <DialogTitle className="text-xl text-[#25201C] font-semibold text-left hidden">
            Ajouter un atelier
          </DialogTitle>
        </DialogHeader>
        <AcceptOrderForm />
      </DialogContent>
    </Dialog>
  );
};
