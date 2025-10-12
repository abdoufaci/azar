"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModalData, useModal } from "@/hooks/use-modal-store";

interface Props {
  data: ModalData;
}

export const AddWorkshopButton = ({ data }: Props) => {
  const { onOpen } = useModal();
  return (
    <div
      onClick={() => onOpen("manageWorkShop", data)}
      className={cn(
        "h-4 w-4 rounded-md border  flex items-center justify-center cursor-pointer border-[#5A5A5A]"
      )}>
      <Plus className={cn("h-3 w-3 text-[#5A5A5A]")} />
    </div>
  );
};
