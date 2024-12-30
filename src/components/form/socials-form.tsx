"use client";
import { SocialsInsert, socialsInsertSchema } from "@/db/schema/socials.schme";
import { IImages } from "@/types/profile.type";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import SingleImageSelector from "../single-image-selector";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { inserSocial } from "@/app/dashboard/socials/action";

interface SocialsFormProps {
  images: IImages[];
}
export const SocialsForm: React.FC<SocialsFormProps> = ({ images }) => {
  const [isPending, startTransition] = useTransition();
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
    startTransition(async () => {
      try {
        console.log(values);
        await inserSocial(values);
        toast.success("Insert Social successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to Insert Social");
      }
    });
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
                <SingleImageSelector
                  control={form.control}
                  images={images}
                  name="icon"
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
