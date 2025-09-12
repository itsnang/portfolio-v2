"use client";
import { inserSocial } from "@/app/dashboard/socials/action";
import { SocialsInsert, socialsInsertSchema } from "@/db/schema/socials.schme";
import { cn } from "@/lib/utils";
import { IImages } from "@/types/profile.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImageSelector } from "../image-selector";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface SocialsFormProps {
  images: IImages[];
}
export const SocialsForm: React.FC<SocialsFormProps> = ({ images }) => {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<SocialsInsert>({
    resolver: zodResolver(socialsInsertSchema),
    defaultValues: {
      userId: "1",
      name: "",
      icon: "",
      url: "",
      isActive: true,
    },
  });

  async function onSubmit(values: SocialsInsert) {
    setIsPending(true);
    try {
      console.log(values);
      await inserSocial(values);
      toast.success("Insert Social successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Insert Social");
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
                <Input placeholder="Enter socail name" {...field} />
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
                <Input placeholder="Enter socail url" {...field} />
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
        <Button type="submit" className="w-full h-12">
          <LoaderCircle
            className={cn("animate-spin size-4 hidden", {
              block: isPending,
            })}
          />
          Submit
        </Button>
      </form>
    </Form>
  );
};
