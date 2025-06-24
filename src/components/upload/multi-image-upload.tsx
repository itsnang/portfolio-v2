"use client";

import React, { useTransition, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { uploadStagedFile } from "@/app/dashboard/images/action";
import { FolderSelector } from "@/components/folder-selector";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface MultiImageUploadFormData {
  images: File[];
}

export const MultiImageUpload = () => {
  const [isPending, startTransition] = useTransition();
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const router = useRouter();
  const form = useForm<MultiImageUploadFormData>({
    defaultValues: {
      images: [],
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
      "image/jfif": [],
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      if (previewUrls.length + acceptedFiles.length > 5) {
        toast.error("Cannot add more than 5 images");
        return;
      }

      const newPreviewUrls = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      form.setValue("images", [...form.getValues("images"), ...acceptedFiles]);
    },
  });

  const removeImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    const currentImages = form.getValues("images");
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: MultiImageUploadFormData) => {
    if (!selectedFolder) {
      toast.error("Please select a folder");
      return;
    }

    if (data.images.length === 0) {
      toast.error("Please select at least one image to upload");
      return;
    }

    startTransition(async () => {
      try {
        for (const image of data.images) {
          await uploadStagedFile(image, selectedFolder);
        }
        toast.success("Images uploaded successfully");
        router.push("/dashboard/images");
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload images");
      }
    });
  };

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FolderSelector
            onFolderSelect={setSelectedFolder}
            selectedFolder={selectedFolder}
          />

          <div
            {...getRootProps()}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-6 transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25",
              previewUrls.length >= 5
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            )}
          >
            <input {...getInputProps()} disabled={previewUrls.length >= 5} />
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Upload className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {previewUrls.length >= 5
                  ? "Maximum 5 images reached"
                  : "Drag & drop images here, or click to select"}
              </p>
              <p className="text-xs text-muted-foreground">
                {previewUrls.length > 0
                  ? `${previewUrls.length}/5 images selected`
                  : "Select up to 5 images"}
              </p>
            </div>
          </div>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={url}
                    alt={`Preview image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover rounded-lg"
                    loading="lazy"
                    quality={75}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          className="w-full py-6"
          type="submit"
          disabled={!selectedFolder || previewUrls.length === 0}
        >
          <LoaderCircle
            className={cn("animate-spin size-4 hidden", {
              block: isPending,
            })}
          />
          Upload {previewUrls.length} Image{previewUrls.length !== 1 ? "s" : ""}
        </Button>
      </form>
    </FormProvider>
  );
};
