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
import { SupplierProduct } from "@prisma/client";
import { SupplierProductInTable } from "@/types/types";
import ManageSupplierProductForm from "../forms/manage-supplier-product-form";

interface Props {
  onClose: () => void;
  isModalOpen: boolean;
  product: SupplierProductInTable | null;
  addProductOptimitic: (item: SupplierProductInTable) => void;
  updateProductOptimitic: (item: SupplierProductInTable) => void;
}

export const ManageSupplierProductModal = ({
  isModalOpen,
  onClose,
  product,
  addProductOptimitic,
  updateProductOptimitic,
}: Props) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className={cn("bg-white text-black w-full max-w-xl")}>
        <DialogHeader className="flex flex-col items-center gap-2 py-2 ">
          <DialogTitle className="text-xl text-[#25201C] font-semibold text-center">
            Ajouter un produit
          </DialogTitle>
        </DialogHeader>
        <ManageSupplierProductForm
          product={product}
          addProductOptimitic={(item) => addProductOptimitic(item)}
          updateProductOptimitic={(item) => updateProductOptimitic(item)}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
