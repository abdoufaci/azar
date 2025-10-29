"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { useModal } from "@/hooks/use-modal-store";
import { ManageWorkShopForm } from "../forms/manage-work-shop-form";
import { AcceptOrderForm } from "../forms/accept-order-form";
import { ManageInvoiceForm } from "../forms/manage-invoice-form";
import { months } from "@/lib/months";

export const ManageInvoiceModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "manageInvoice";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black w-full max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2 py-2 ">
          <DialogTitle className="text-xl text-[#25201C] font-semibold text-center">
            Facture de <span className="text-brand">Nom</span>
          </DialogTitle>
          <DialogDescription className="text-brand">
            {months[(data?.date || new Date()).getMonth()]}{" "}
            {(data?.date || new Date()).getFullYear()}
          </DialogDescription>
        </DialogHeader>
        <ManageInvoiceForm />
      </DialogContent>
    </Dialog>
  );
};
