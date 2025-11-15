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
import { usePathname } from "next/navigation";

export const ChooseTissuModal = () => {
  const { isOpen, onClose, type } = useModal();
  const pathname = usePathname();
  const lang = pathname.split("/")[1];

  const isModalOpen = isOpen && type === "chooseTissu";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        dir={lang === "fr" ? "ltr" : "rtl"}
        className={cn(
          "bg-white text-black w-full max-w-xl",
          tajawal.className
        )}>
        <DialogHeader className="py-2 ">
          <DialogTitle
            className={cn(
              "text-xl text-[#25201C] font-semibold",
              lang === "ar" ? "text-right" : ""
            )}>
            {lang === "ar" ? "اختر" : "choisir"}
          </DialogTitle>
        </DialogHeader>
        <ChooseTissuForm />
      </DialogContent>
    </Dialog>
  );
};
