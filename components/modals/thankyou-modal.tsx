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

export const ThankyouModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "thankyou";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black w-full max-w-xl">
        <DialogHeader className="py-2 ">
          <DialogTitle className="text-xl text-[#25201C] font-semibold text-left hidden">
            Ajouter un atelier
          </DialogTitle>
        </DialogHeader>
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Brand Logo */}
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-[#fcb707]">Azar</span>{" "}
            <span className="text-[#232626]">Furniture</span>
          </h1>

          {/* Main Thank You Message in Arabic */}
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#fcb707] leading-tight">
            شكراً لطلبك!
          </h2>

          {/* Subtitle with Heart Emoji */}
          <p
            className="text-lg md:text-xl text-[#6a6a6a] leading-relaxed"
            dir="rtl">
            💛 نشكرك على ثقتك بنا، ونتمنى أن يضيف أثاثنا لمسة جمال وراحة إلى
            منزلك.
          </p>

          {/* Phone Number */}
          <div className="flex items-center justify-center gap-3 pt-8">
            <svg
              width="21"
              height="22"
              viewBox="0 0 21 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.8644 0.539001L15.8183 0.796748C16.985 1.11244 18.0484 1.72848 18.9027 2.58343C19.757 3.43838 20.3721 4.50235 20.6869 5.66924L20.9436 6.62221L19.0377 7.13672L18.78 6.18375C18.555 5.35024 18.1155 4.59027 17.5052 3.97964C16.895 3.36901 16.1352 2.92906 15.3019 2.70368L14.3489 2.44494L14.8644 0.539001ZM2.33658e-05 0.749346H8.47307L9.94153 7.35595L8.10471 9.19276C9.18423 10.874 10.6134 12.3028 12.2948 13.3819L14.1316 11.5461L20.7382 13.0145V21.4876H19.7507C15.9491 21.4935 12.2273 20.3972 9.03596 18.3314C6.68293 16.8085 4.67905 14.8047 3.15618 12.4516C1.09046 9.26025 -0.0058361 5.53847 2.33658e-05 1.73688V0.749346ZM2.00175 2.72441C2.16789 5.80549 3.13789 8.78936 4.81524 11.3792C6.1863 13.4973 7.99024 15.3013 10.1084 16.6723C12.6982 18.3498 15.6821 19.3198 18.7632 19.4858V14.5985L14.7607 13.7097L12.6138 15.8576L11.9591 15.4853C9.47317 14.0725 7.41508 12.0144 6.00225 9.52852L5.62995 8.87379L7.77784 6.72689L6.88906 2.72441H2.00175ZM13.9618 3.87489L14.9157 4.13264C15.4991 4.29048 16.0308 4.59851 16.4579 5.02598C16.885 5.45345 17.1926 5.98544 17.35 6.56888L17.6068 7.52185L15.7008 8.03636L15.4431 7.08339C15.3755 6.83333 15.2436 6.60535 15.0605 6.42219C14.8773 6.23903 14.6493 6.1071 14.3993 6.03957L13.4463 5.78182L13.9618 3.87489Z"
                fill="#6A6A6A"
              />
            </svg>

            <span className="text-xl md:text-2xl text-[#6a6a6a] font-medium">
              (0541-368-526)
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
