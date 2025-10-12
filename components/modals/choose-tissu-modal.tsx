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
import { ChooseTissuForm } from "../forms/choose-tissu-form";
import { cn } from "@/lib/utils";
import { tajawal } from "@/app/fonts";

export const ChooseTissuModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "chooseTissu";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "bg-white text-black w-full max-w-xl",
          tajawal.className
        )}>
        <DialogHeader className="py-2 ">
          <DialogTitle className="text-xl text-[#25201C] font-semibold text-right">
            اختر
          </DialogTitle>
        </DialogHeader>
        <ChooseTissuForm />
      </DialogContent>
    </Dialog>
  );
};
