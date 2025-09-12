"use client";
import { uploadStagedFile } from "@/app/dashboard/images/action";
import { FolderSelector } from "@/components/folder-selector";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

type InitialValueType = {
  image: File | null;
};

export const ImageUploadForm = () => {
  const [isPending, setIsPending] = useState(false);
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

    if (!data.image) {
      toast.error("Please select an image to upload");
      return;
    }

    setIsPending(true);
    try {
      await uploadStagedFile(data.image, selectedFolder);
      toast.success("Image uploaded successfully");
      router.push("/dashboard/images");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setIsPending(false);
    }
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
