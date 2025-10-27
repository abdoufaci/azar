"use client";

import { AcceptOrderModal } from "@/components/modals/accept-order-modal";
import { ChooseTissuModal } from "@/components/modals/choose-tissu-modal";
import { ManageInvoiceModal } from "@/components/modals/manage-invoice-modal";
import { ManageWorkShopModal } from "@/components/modals/manage-work-shop-modal";
import { ThankyouModal } from "@/components/modals/thankyou-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  //code for hydrations error
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  //code for hydrations error

  return (
    <>
      <ManageWorkShopModal />
      <ThankyouModal />
      <ChooseTissuModal />
      <AcceptOrderModal />
      <ManageInvoiceModal />
    </>
  );
};
