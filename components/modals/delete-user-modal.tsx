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
import { useModal } from "@/hooks/use-modal-store";
import { deleteUser } from "@/actions/mutations/users/delete-user";

export const DeleteUserModal = () => {
  const { isOpen, onClose, type, onOpen, data } = useModal();
  const [isPending, startTranstion] = useTransition();

  const isModalOpen = isOpen && type === "deleteUser";
  const user = data?.user;

  const onDelete = () => {
    startTranstion(() => {
      deleteUser(user?.id || "")
        .then(() => {
          data?.onDeleteUser?.();
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
          <span className="text-[#CE2A2A]">@{user?.name}</span>
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
