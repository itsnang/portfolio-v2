"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useController, Control, Path, PathValue } from "react-hook-form";
import {
  ImagePlus,
  Image as ImageIcon,
  Cloudy,
  X,
  Trash2,
  Grid3X3,
  LayoutGrid,
  Check,
} from "lucide-react";
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
  aspectRatio = "square",
}: ImageSelectorProps<TFieldValues>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [images, setImages] = useState<IImages[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);
  const [gridSize, setGridSize] = useState(4);
  const { field } = useController({
    name,
    control,
    defaultValue: (mode === "single" ? "" : []) as PathValue<
      TFieldValues,
      Path<TFieldValues>
    >,
  });

  const selectedInfo = useMemo(() => {
    if (mode === "single") {
      const hasSelection = field.value && typeof field.value === "string";
      return {
        count: hasSelection ? 1 : 0,
        total: images.length,
        hasSelection,
      };
    } else {
      const selectedArray = (field.value as string[]) || [];
      return {
        count: selectedArray.length,
        total: images.length,
        hasSelection: selectedArray.length > 0,
      };
    }
  }, [field.value, images.length, mode]);

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
      field.onChange(image === field.value ? "" : image);
      setIsOpen(false);
    } else {
      const currentValue = (field.value as string[]) || [];
      const updatedSelection = currentValue.includes(image)
        ? currentValue.filter((img) => img !== image)
        : [...currentValue, image];
      field.onChange(updatedSelection);
    }
  };

  const handleClearSelection = () => {
    if (mode === "single") {
      field.onChange("");
    } else {
      field.onChange([]);
    }
    toast.success("Selection cleared");
  };

  const handleRemoveImage = (imageToRemove: string) => {
    if (mode === "multiple") {
      const currentValue = (field.value as string[]) || [];
      const updatedSelection = currentValue.filter(
        (img) => img !== imageToRemove
      );
      field.onChange(updatedSelection);
    }
  };

  const handleSave = () => {
    setIsOpen(false);
    if (selectedInfo.hasSelection) {
      toast.success(
        `${selectedInfo.count} image${selectedInfo.count > 1 ? "s" : ""} selected`
      );
    }
  };

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  }[aspectRatio];

  const gridCols =
    {
      2: "grid-cols-2",
      3: "grid-cols-2 sm:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
      5: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5",
    }[gridSize] || "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  const defaultTrigger =
    mode === "single" ? (
      <div className="relative w-full max-w-3xl mx-auto cursor-pointer group">
        <div
          className={cn(
            `${aspectRatioClass} relative rounded-xl overflow-hidden border-2 border-dashed transition-all duration-300 hover:border-primary/50`,
            field.value
              ? "border-border bg-background shadow-sm"
              : "border-muted-foreground/25 bg-muted/5 hover:bg-muted/10"
          )}
        >
          {field.value && typeof field.value === "string" ? (
            <>
              <Image
                src={field.value}
                alt="Selected image"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-all duration-300 group-hover:scale-[1.02]"
                priority
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="p-4 rounded-full bg-muted/50 group-hover:bg-muted transition-colors duration-200">
                <ImageIcon className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Click to select an image
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Browse from your image library
                </p>
              </div>
            </div>
          )}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300",
              field.value ? "opacity-0 group-hover:opacity-100" : "opacity-0"
            )}
          >
            <Button
              variant="secondary"
              className="pointer-events-none shadow-lg border-0 bg-white/90 hover:bg-white text-black"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              {field.value ? "Change Image" : "Select Image"}
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <Button
        className="py-6 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        variant="outline"
      >
        <Cloudy size={20} className="mr-3 text-primary" />
        <span className="font-medium">Open Image Manager</span>
        {selectedInfo.hasSelection && (
          <Badge variant="secondary" className="ml-3 px-2 py-0.5">
            {selectedInfo.count}
          </Badge>
        )}
      </Button>
    );

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
        <DialogContent className="w-[95vw] sm:max-w-[800px] h-[85vh] sm:max-h-[75vh] p-0 rounded-xl border-0 shadow-2xl flex flex-col overflow-hidden">
          <DialogHeader className="border-b border-border/50 px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1 min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl font-semibold truncate">
                  {mode === "single" ? "Select Image" : "Image Manager"}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  {mode === "single"
                    ? "Choose an image from your library"
                    : "Manage your image selection"}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-row justify-between items-center px-4 py-2 border-b border-border/30 flex-shrink-0">
            <FolderSelector
              onFolderSelect={setSelectedFolder}
              selectedFolder={selectedFolder}
            />
            <div className="flex items-center gap-2">
              {mode === "multiple" && selectedInfo.hasSelection && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Badge
                    variant="outline"
                    className="px-2 sm:px-3 py-1 text-xs"
                  >
                    {selectedInfo.count}/{selectedInfo.total}
                  </Badge>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearSelection}
                    className="h-7 sm:h-8 px-2 sm:px-3"
                  >
                    <X className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-muted rounded-lg">
                <Button
                  variant={gridSize === 2 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize(2)}
                  className="h-6 w-6 sm:h-7 sm:w-7 p-0 sm:hidden"
                >
                  <Grid3X3 className="h-2.5 w-2.5" />
                </Button>
                <Button
                  variant={gridSize === 3 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize(3)}
                  className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                >
                  <Grid3X3 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
                <Button
                  variant={gridSize === 4 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize(4)}
                  className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                >
                  <LayoutGrid className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
                <Button
                  variant={gridSize === 5 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize(5)}
                  className="h-6 w-6 sm:h-7 sm:w-7 p-0 hidden sm:flex"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-4 sm:px-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-muted rounded-full"></div>
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Loading images...
                    </p>
                    <p className="text-xs text-muted-foreground/70 hidden sm:block">
                      Please wait while we fetch your images
                    </p>
                  </div>
                </div>
              ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[30vh] gap-4">
                  <div className="p-6 rounded-full bg-muted/50">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-base sm:text-lg font-medium text-muted-foreground">
                      No images found
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground/70 max-w-sm px-4 sm:px-0">
                      Try selecting a different folder or upload some images to
                      get started
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={cn("grid gap-3 sm:gap-4 py-4 sm:py-6", gridCols)}
                >
                  {images.map((image, index) => (
                    <ImageCard
                      key={`${image.imageUrl}-${index}`}
                      image={image.imageUrl}
                      isSelected={
                        mode === "single"
                          ? image.imageUrl === (field.value as string)
                          : ((field.value as string[]) || []).includes(
                              image.imageUrl
                            )
                      }
                      onSelect={handleImageSelect}
                      aspectRatio="square"
                      index={index}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {mode === "multiple" && (
            <div className="flex justify-between items-center p-4 border-t border-border/50 bg-muted/20 flex-shrink-0">
              <div className="text-xs sm:text-sm text-muted-foreground">
                {selectedInfo.count > 0
                  ? `${selectedInfo.count} image${selectedInfo.count > 1 ? "s" : ""} selected`
                  : "No images selected"}
              </div>
              <Button
                onClick={handleSave}
                className="px-4 sm:px-6 shadow-sm text-sm"
              >
                {selectedInfo.count > 0 ? (
                  <>
                    <Check className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Save Selection</span>
                    <span className="sm:hidden">Save</span>
                  </>
                ) : (
                  "Close"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {mode === "multiple" && selectedInfo.hasSelection && (
        <div className="mt-6 sm:mt-8 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold truncate">
                Selected Images
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {selectedInfo.count} image{selectedInfo.count !== 1 ? "s" : ""}{" "}
                ready to use
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              className="h-8 sm:h-9 px-3 sm:px-4 flex-shrink-0"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Clear All</span>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {((field.value as string[]) || [])
              .filter((image) => image)
              .map((image, index) => (
                <div
                  key={`selected-${image}-${index}`}
                  className="group relative rounded-xl overflow-hidden border border-border/50 bg-background shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className={`${aspectRatioClass} relative`}>
                    <Image
                      src={image}
                      alt={`Selected Image ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                      quality={75}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRemoveImage(image)}
                        className="h-6 w-6 sm:h-7 sm:w-7 p-0 bg-white/90 hover:bg-white border-0 shadow-md"
                      >
                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-600" />
                      </Button>
                    </div>
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
  index?: number;
}

function ImageCard({
  image,
  isSelected,
  onSelect,
  aspectRatio,
  index = 0,
}: ImageCardProps) {
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  }[aspectRatio];

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-lg",
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-md transform scale-[1.02]"
          : "border-transparent hover:border-border/50 hover:transform hover:scale-[1.01]"
      )}
      onClick={() => onSelect(image)}
      style={{
        animationDelay: `${index * 50}ms`,
        animation: "fadeInUp 0.5s ease-out forwards",
      }}
    >
      <div className={`${aspectRatioClass} relative bg-muted/50`}>
        <Image
          src={image}
          alt={`Gallery image ${index + 1}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-all duration-300 group-hover:scale-110"
          loading="lazy"
          quality={75}
        />

        {/* Selection overlay */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300",
            isSelected
              ? "bg-primary/20 backdrop-blur-[1px]"
              : "bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100"
          )}
        />

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-10">
            <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full shadow-lg">
              <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
