"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IImages } from "@/types/profile.type";
import { ScrollArea } from "./scroll-area";
import Image from "next/image";

interface ImageSelectionDialogProps {
  images: IImages[];
  onSelect: (url: string) => void;
  triggerText: string;
  className?: string;
}

export function ImageSelectionDialog({
  images,
  onSelect,
  triggerText,
  className,
}: ImageSelectionDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] p-0">
        <DialogHeader>
          <DialogTitle>Select an Image</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] px-6">
          <div className="grid grid-cols-5 gap-4 py-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="aspect-[4/3] relative group cursor-pointer rounded-lg overflow-hidden border-2"
              >
                <Image
                  src={image.imageUrl}
                  alt="Gallery image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                  onClick={() => handleSelect(image.imageUrl)}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
