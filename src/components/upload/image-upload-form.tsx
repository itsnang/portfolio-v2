"use client";
import { uploadStagedFile } from "@/app/dashboard/images/action";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";

interface InitialValueType {
  image: File | Blob | null;
}

export const ImageUploadForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<InitialValueType>({
    defaultValues: {
      image: null,
    },
  });

  const onSubmit = async (data: InitialValueType) => {
    startTransition(async () => {
      if (!data.image) {
        toast.error("Please select an image to upload");
        return;
      }
      try {
        await uploadStagedFile(data.image);
        toast.success("Image uploaded successfully");
        router.push("/dashboard/images");
      } catch (error) {
        console.log(error);
        toast.error("Failed to upload image");
      }
    });
  };
  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <ImageUpload name="image" />
        <Button className="w-full py-6" type="submit">
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
