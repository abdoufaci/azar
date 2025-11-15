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
import { Desk } from "@prisma/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (desk: Desk) => void;
  data: DeskFormData;
  currentData: DeskFormData;
  deskId: string;
}

export const SaveEditDeskModal = ({
  isOpen,
  onClose,
  currentData,
  data,
  deskId,
  onComplete,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black w-full max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2 py-2 ">
          <DialogTitle className="text-xl text-[#25201C] font-semibold text-center">
            Êtes-vous sûr de vouloir modifier ceci?
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1>
              Nom{" "}
              <span className="text-brand font-medium">{currentData.name}</span>
            </h1>
            <svg
              width="24"
              height="14"
              viewBox="0 0 24 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 0C16 0.742 16.733 1.85 17.475 2.78C18.429 3.98 19.569 5.027 20.876 5.826C21.856 6.425 23.044 7 24 7M24 7C23.044 7 21.855 7.575 20.876 8.174C19.569 8.974 18.429 10.021 17.475 11.219C16.733 12.15 16 13.26 16 14M24 7L0 7"
                stroke="black"
              />
            </svg>
            <h1>
              Nom <span className="text-brand font-medium">{data.name}</span>
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <h1>
              Type{" "}
              <span className="text-brand font-medium">
                {currentData.type === "DEPOSIT" ? "Acompte" : "Versement"}
              </span>
            </h1>
            <svg
              width="24"
              height="14"
              viewBox="0 0 24 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 0C16 0.742 16.733 1.85 17.475 2.78C18.429 3.98 19.569 5.027 20.876 5.826C21.856 6.425 23.044 7 24 7M24 7C23.044 7 21.855 7.575 20.876 8.174C19.569 8.974 18.429 10.021 17.475 11.219C16.733 12.15 16 13.26 16 14M24 7L0 7"
                stroke="black"
              />
            </svg>
            <h1>
              Type{" "}
              <span className="text-brand font-medium">
                {data.type === "DEPOSIT" ? "Acompte" : "Versement"}
              </span>
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <h1>
              Montant{" "}
              <span className="text-brand font-medium">
                {currentData.amount}da
              </span>
            </h1>
            <svg
              width="24"
              height="14"
              viewBox="0 0 24 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 0C16 0.742 16.733 1.85 17.475 2.78C18.429 3.98 19.569 5.027 20.876 5.826C21.856 6.425 23.044 7 24 7M24 7C23.044 7 21.855 7.575 20.876 8.174C19.569 8.974 18.429 10.021 17.475 11.219C16.733 12.15 16 13.26 16 14M24 7L0 7"
                stroke="black"
              />
            </svg>
            <h1>
              Montant{" "}
              <span className="text-brand font-medium">{data.amount}da</span>
            </h1>
          </div>
        </div>
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
            disabled={isPending}
            onClick={() => {
              startTransition(() => {
                updateDesk({ data, deskId })
                  .then((res) => {
                    toast.success("Success !");
                    onComplete(res);
                  })
                  .catch(() => toast.error("Erreur"));
              });
            }}
            type="button"
            variant={"brand"}
            size={"lg"}
            className="w-full">
            Confirmé
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
