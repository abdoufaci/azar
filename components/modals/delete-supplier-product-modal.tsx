"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteSupplierProduct } from "@/actions/mutations/supply/delete-supplier-product";
import { SupplierProductInTable } from "@/types/types";

interface Props {
  onClose: () => void;
  isModalOpen: boolean;
  product: SupplierProductInTable;
  deleteProductOptimistic: () => void;
}

export const DeleteSupplierProductModal = ({
  isModalOpen,
  onClose,
  product,
  deleteProductOptimistic,
}: Props) => {
  const [isPending, startTranstion] = useTransition();

  const onDelete = () => {
    startTranstion(() => {
      deleteSupplierProduct({ id: product.id })
        .then(() => {
          deleteProductOptimistic();
          toast.success("deleted !");
          onClose();
        })
        .catch(() => toast.error("Something went wrong ."));
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xl ">
        <DialogHeader className="py-2 ">
          <DialogTitle className="text-xl font-semibold text-left"></DialogTitle>
        </DialogHeader>
        <h1 className="text-lg font-medium text-center">
          Êtes-vous sûr de vouloir supprimer{" "}
          <span className="text-[#CE2A2A]">@{product?.name}</span>
        </h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={onClose}
            variant={"blackOutline"}
            size={"lg"}
            className="w-full rounded-full">
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={onDelete}
            type="button"
            variant={"delete"}
            size={"lg"}
            className="w-full rounded-full">
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
