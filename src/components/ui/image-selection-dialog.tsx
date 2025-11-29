"use client";

import { useState, useEffect, useCallback } from "react";
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
import { FolderSelector } from "../folder-selector";
import { getImages } from "@/app/dashboard/images/action";
import { toast } from "sonner";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";

interface ImageSelectionDialogProps {
  images: IImages[];
  onSelect: (url: string) => void;
  triggerText: string;
  className?: string;
}

export function ImageSelectionDialog({
  images: initialImages,
  onSelect,
  triggerText,
  className,
}: ImageSelectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [images, setImages] = useState<IImages[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!open) {
      setSelectedFolder("");
      setImages(initialImages);
      return;
    }

    if (selectedFolder) {
      loadFolderImages();
    } else {
      setImages(initialImages);
    }
  }, [selectedFolder, open, initialImages, loadFolderImages]);

  const handleSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  const handleFolderChange = (folderPath: string) => {
    setSelectedFolder(folderPath);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Select an Image</DialogTitle>
          <div className="pt-4">
            <FolderSelector
              onFolderSelect={handleFolderChange}
              selectedFolder={selectedFolder}
            />
          </div>
        </DialogHeader>
        <ScrollArea className="h-[60vh] px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[30vh]">
              <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[30vh] gap-4 py-8">
              <p className="text-muted-foreground">
                No images found in this folder
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
              {images.map((image, index) => (
                <div
                  key={`${image.imageUrl}-${index}`}
                  className="aspect-4/3 relative group cursor-pointer rounded-lg overflow-hidden border-2 hover:border-primary transition-colors"
                >
                  <Image
                    src={image.imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    quality={75}
                    onClick={() => handleSelect(image.imageUrl)}
                  />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
