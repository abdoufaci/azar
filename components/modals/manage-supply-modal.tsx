"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ManageInvoiceForm } from "../forms/manage-invoice-form";
import { months } from "@/lib/months";
import { ManageSupplyForm } from "../forms/manage-supply-form";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const ManageSupplyModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [step, setStep] = useState<1 | 2>(1);

  const isModalOpen = isOpen && type === "manageSupply";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "bg-white text-black w-full",
          step === 1 ? "max-w-xl" : "max-w-4xl"
        )}>
        <DialogHeader className="flex flex-col items-center gap-2 py-2 ">
          <DialogTitle className="text-xl text-[#25201C] font-semibold text-center">
            {""}
          </DialogTitle>
        </DialogHeader>
        <ManageSupplyForm step={step} setStep={setStep} />
      </DialogContent>
    </Dialog>
  );
};
