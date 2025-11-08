"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useModal } from "@/hooks/use-modal-store";

export const ImagesModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "images";

  if (!isModalOpen) {
    return;
  }

  const { images } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent outline-none border-none shadow-none text-black w-full max-w-xl [&>button]:hidden">
        <DialogHeader className="py-2 hidden"></DialogHeader>
        <Carousel>
          <CarouselContent className="w-[450px]">
            {images?.map((image, idx) => (
              <CarouselItem key={idx}>
                <Image
                  alt="tour"
                  quality={100}
                  src={`https://${process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME}/${image.id}`}
                  height={500}
                  width={400}
                  className="object-cover w-[500px] h-[450px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};
