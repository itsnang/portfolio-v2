"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useController, Control, Path, PathValue } from "react-hook-form";
import { ImagePlus, Image as ImageIcon, Cloudy, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IImages } from "@/types/profile.type";
import { FolderSelector } from "./folder-selector";
import { getImages } from "@/app/dashboard/images/action";
import { toast } from "sonner";

interface ImageSelectorProps<TFieldValues extends Record<string, unknown>> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  images: IImages[];
  mode?: "single" | "multiple";
  trigger?: React.ReactNode;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait";
}

export const ImageSelector = <TFieldValues extends Record<string, unknown>>({
  control,
  name,
  images: initialImages,
  mode = "single",
  trigger,
  className,
  aspectRatio = "video",
}: ImageSelectorProps<TFieldValues>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [images, setImages] = useState<IImages[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);
  const { field } = useController({
    name,
    control,
    defaultValue: (mode === "single" ? "" : []) as PathValue<
      TFieldValues,
      Path<TFieldValues>
    >,
  });

  const loadFolderImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const folderImages = await getImages(selectedFolder);
      setImages(folderImages);
    } catch (error) {
      console.error("Error loading folder images:", error);
      toast.error("Failed to load folder images");
    } finally {
      setIsLoading(false);
    }
  }, [selectedFolder]);

  useEffect(() => {
    if (selectedFolder) {
      loadFolderImages();
    } else {
      setImages(initialImages);
    }
  }, [selectedFolder, initialImages, loadFolderImages]);

  const handleImageSelect = (image: string) => {
    if (mode === "single") {
      field.onChange(image === field.value ? null : image);
      setIsOpen(false);
    } else {
      const currentValue = field.value as string[];
      const updatedSelection = currentValue.includes(image)
        ? currentValue.filter((img) => img !== image)
        : [...currentValue, image];
      field.onChange(updatedSelection);
    }
  };

  const handleSave = () => {
    setIsOpen(false);
  };

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-[2/1]",
    portrait: "aspect-[4/3]",
  }[aspectRatio];

  const defaultTrigger =
    mode === "single" ? (
      <div className="relative w-full max-w-3xl mx-auto cursor-pointer group">
        <div
          className={cn(
            `${aspectRatioClass} relative rounded-lg overflow-hidden border-2 border-dashed`,
            field.value ? "border-muted" : "border-muted-foreground/25"
          )}
        >
          {field.value && typeof field.value === "string" ? (
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
              field.value ? "opacity-0 group-hover:opacity-100" : "opacity-0"
            )}
          >
            <Button variant="secondary" className="pointer-events-none">
              <ImagePlus className="h-4 w-4 mr-2" />
              Change Image
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <Button className="py-6" variant="outline">
        <Cloudy size={20} className="mr-2 text-primary" /> Open Image Manager
      </Button>
    );

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>
              {mode === "single" ? "Select Image" : "Images Manager"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pb-0">
            <FolderSelector
              onFolderSelect={setSelectedFolder}
              selectedFolder={selectedFolder}
            />
          </div>
          <ScrollArea className="h-[60vh] px-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-4 py-4">
                {images.map((image, index) => (
                  <ImageCard
                    key={index}
                    image={image.imageUrl}
                    isSelected={
                      mode === "single"
                        ? image.imageUrl === (field.value as string)
                        : (field.value as string[]).includes(image.imageUrl)
                    }
                    onSelect={handleImageSelect}
                    aspectRatio={aspectRatio}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
          {mode === "multiple" && (
            <div className="mt-4 flex justify-end p-6 pt-0">
              <Button onClick={handleSave}>Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {mode === "multiple" && (field.value as string[]).length > 0 && (
        <div className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(field.value as string[])
              .filter((image) => image)
              .map((image, index) => (
                <div
                  key={index}
                  className="group relative rounded-lg overflow-hidden"
                >
                  <div className={`${aspectRatioClass} relative`}>
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

interface ImageCardProps {
  image: string;
  isSelected: boolean;
  onSelect: (image: string) => void;
  aspectRatio: "square" | "video" | "portrait";
}

function ImageCard({
  image,
  isSelected,
  onSelect,
  aspectRatio,
}: ImageCardProps) {
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-[2/1]",
    portrait: "aspect-[4/3]",
  }[aspectRatio];

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-lg overflow-hidden border-2",
        isSelected ? "border-primary" : "border-transparent"
      )}
      onClick={() => onSelect(image)}
    >
      <div className={`${aspectRatioClass} relative`}>
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
