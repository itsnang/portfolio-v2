"use client";
import React, { useTransition, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { uploadStagedFile } from "@/app/dashboard/images/action";
import { FolderSelector } from "@/components/folder-selector";

type InitialValueType = {
  image: File | null;
};

export const ImageUploadForm = () => {
  const [isPending, startTransition] = useTransition();
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const router = useRouter();
  const form = useForm<InitialValueType>({
    defaultValues: {
      image: null,
    },
  });

  const onSubmit = async (data: InitialValueType) => {
    if (!selectedFolder) {
      toast.error("Please select a folder");
      return;
    }

    startTransition(async () => {
      if (!data.image) {
        toast.error("Please select an image to upload");
        return;
      }
      try {
        await uploadStagedFile(data.image, selectedFolder);
        toast.success("Image uploaded successfully");
        router.push("/dashboard/images");
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image");
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
          <ImageUpload name="image" />
        </div>
        <Button
          className="w-full py-6"
          type="submit"
          disabled={!selectedFolder}
        >
          <LoaderCircle
            className={cn("animate-spin size-4 hidden", {
              block: isPending,
            })}
          />
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};
