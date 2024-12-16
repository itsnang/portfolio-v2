"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useController, Control } from "react-hook-form";
import { Cloudy } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { IImages } from "@/types/profile.type";

interface ImageSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  images: IImages[];
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  control,
  name,
  images,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { field } = useController({
    name,
    control,
    defaultValue: [],
  });
  const handleImageToggle = (image: string) => {
    const updatedSelection = field.value.includes(image)
      ? field.value.filter((img: string) => img !== image)
      : [...field.value, image];
    field.onChange(updatedSelection);
  };

  const handleSave = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="py-6" variant="outline">
            <Cloudy size={20} className="mr-2 text-primary" /> Open Image
            Manager
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Images manager</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] px-6">
            <div className="grid grid-cols-5 gap-4 mt-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative cursor-pointer rounded-lg overflow-hidden border-2",
                    field.value.includes(image)
                      ? "border-primary"
                      : "border-transparent"
                  )}
                  onClick={() => handleImageToggle(image.imageUrl)}
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={image.imageUrl}
                      alt={image.id}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="transition-transform duration-300 group-hover:scale-110 object-cover"
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={field.value.includes(image.imageUrl)}
                      onCheckedChange={() => handleImageToggle(image.imageUrl)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      {field.value.length > 0 && (
        <div className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {field.value
              .filter((image: string) => image) // Filter out empty or invalid strings
              .map((image: string, index: number) => (
                <div
                  key={index}
                  className="group relative rounded-lg overflow-hidden"
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={image}
                      alt={`Selected Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
