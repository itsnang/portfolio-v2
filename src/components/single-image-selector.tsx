"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useController, Control } from "react-hook-form";
import { ImagePlus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { IImages } from "@/types/profile.type";

interface ImageSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  images: IImages[];
}

export default function SingleImageSelector({
  control,
  name,
  images,
}: ImageSelectorProps) {
  const [open, setOpen] = useState(false);
  const { field } = useController({
    name,
    control,
    defaultValue: "",
  });

  const handleImageSelect = (image: string) => {
    field.onChange(image === field.value ? null : image);
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="relative w-full max-w-3xl mx-auto cursor-pointer group">
            <div
              className={cn(
                "aspect-[2/1] relative rounded-lg overflow-hidden border-2 border-dashed",
                field.value ? "border-muted" : "border-muted-foreground/25"
              )}
            >
              {field.value ? (
                <Image
                  src={field.value}
                  alt="Selected image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/5">
                  <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    Click to select an image
                  </p>
                </div>
              )}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
                  field.value
                    ? "opacity-0 group-hover:opacity-100"
                    : "opacity-0"
                )}
              >
                <Button variant="secondary" className="pointer-events-none">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Change Image
                </Button>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Select Image</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] px-6">
            <div className="grid grid-cols-5 gap-4 py-4">
              {images.map((image, index) => (
                <ImageCard
                  key={index}
                  image={image.imageUrl}
                  isSelected={image === field.value}
                  onSelect={handleImageSelect}
                />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ImageCardProps {
  image: string;
  isSelected: boolean;
  onSelect: (image: string) => void;
}

export function ImageCard({ image, isSelected, onSelect }: ImageCardProps) {
  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-lg overflow-hidden border-2",
        isSelected ? "border-primary" : "border-transparent"
      )}
      onClick={() => onSelect(image)}
    >
      <div className="aspect-[4/3] relative">
        <Image
          src={image}
          alt="Gallery image"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(image)}
            className="bg-white/90 border-white/90"
          />
        </div>
      </div>
    </div>
  );
}
