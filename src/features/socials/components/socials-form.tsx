"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createSocialAction, updateSocialAction } from "@/features/socials/actions";
import {
  socialsFormSchema,
  type Socials,
  type SocialsFormValues,
} from "@/features/socials/schemas";
import { cn } from "@/lib/utils";
import { IImages } from "@/types/profile.type";
import { ImageSelector } from "@/components/image-selector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SocialsFormProps {
  images: IImages[];
  initialValues?: Socials;
  onSuccess?: () => void;
}

export const SocialsForm: React.FC<SocialsFormProps> = ({
  images,
  initialValues,
  onSuccess,
}) => {
  const [isPending, setIsPending] = useState(false);
  const isEditing = Boolean(initialValues);

  const form = useForm<SocialsFormValues>({
    resolver: zodResolver(socialsFormSchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          icon: initialValues.icon,
          url: initialValues.url,
          isActive: initialValues.isActive ?? true,
        }
      : {
          name: "",
          icon: "",
          url: "",
          isActive: true,
        },
  });

  async function onSubmit(values: SocialsFormValues) {
    setIsPending(true);
    try {
      const result = isEditing
        ? await updateSocialAction(initialValues!.id, values)
        : await createSocialAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditing ? "Social updated" : "Social added");
      if (!isEditing) form.reset();
      onSuccess?.();
    } catch (error) {
      console.log(error);
      toast.error(isEditing ? "Failed to update social" : "Failed to add social");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="icon"
          render={({}) => (
            <FormItem>
              <FormLabel>Social Logo</FormLabel>
              <FormControl>
                <ImageSelector
                  control={form.control}
                  images={images}
                  name="icon"
                  mode="single"
                  aspectRatio="video"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social name</FormLabel>
              <FormControl>
                <Input placeholder="Enter social name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Link</FormLabel>
              <FormControl>
                <Input placeholder="Enter social url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value || undefined}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
                <FormDescription>
                  Is this social entry currently active?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-12" disabled={isPending}>
          <LoaderCircle
            className={cn("animate-spin size-4 hidden", {
              block: isPending,
            })}
          />
          {isEditing ? "Save Changes" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
