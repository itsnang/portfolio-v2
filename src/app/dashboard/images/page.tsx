"use client";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { uploadStagedFile } from "./action";

interface InitialValueType {
  image: File | Blob | null;
}

function Page() {
  const form = useForm<InitialValueType>({
    defaultValues: {
      image: null,
    },
  });

  const onSubmit = async (data: InitialValueType) => {
    if (!data.image) {
      return;
    }
    await uploadStagedFile(data.image);
    console.log(typeof data.image);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 dark:text-white">
      <FormProvider {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <ImageUpload name="image" />
          <Button className="w-full py-6" type="submit">
            Submit
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default Page;
