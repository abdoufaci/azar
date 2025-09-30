"use client";

import { Button } from "@/components/ui/button";
import { ModalData, ModalType, useModal } from "@/hooks/use-modal-store";
import { Plus } from "lucide-react";

interface Props {
  type: ModalType;
  data?: ModalData;
  title: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "brand"
    | "brand_link";
}

export function OpenDialogButton({
  data = {},
  type,
  title,
  variant = "brand",
}: Props) {
  const { onOpen } = useModal();

  return (
    <Button
      onClick={() => onOpen(type, data)}
      variant={variant}
      className="px-4">
      {title}
    </Button>
  );
}
