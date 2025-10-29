"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { useModal } from "@/hooks/use-modal-store";
import { ManageWorkShopForm } from "../forms/manage-work-shop-form";
import { AcceptOrderForm } from "../forms/accept-order-form";
import { ManageInvoiceForm } from "../forms/manage-invoice-form";
import { months } from "@/lib/months";
import { DeskFormData } from "@/schemas/desk-schema";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { updateDesk } from "@/actions/mutations/stock/update-desk";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export const ConfirmEditDeskModal = ({
  isOpen,
  onClose,
  onContinue,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black w-full max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2 py-2 ">
          <DialogTitle className="text-xl text-[#25201C] font-semibold text-center">
            voulez-vous modifier cela?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex items-center gap-5 justify-center">
          <Button
            onClick={onClose}
            type="button"
            variant={"delete"}
            size={"lg"}
            className="w-full">
            Annulé
          </Button>
          <Button
            onClick={onContinue}
            type="button"
            variant={"brand"}
            size={"lg"}
            className="w-full">
            Oui
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
