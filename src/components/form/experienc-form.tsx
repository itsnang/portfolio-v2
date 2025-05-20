"use client";

import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import SingleImageSelector from "../single-image-selector";
import { IImages } from "@/types/profile.type";
import React, { useTransition } from "react";
import { toast } from "sonner";
import {
  ExperiencesInsert,
  experiencesInsertSchema,
  Experiences,
} from "@/db/schema/experiences.schema";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import {
  insertExperiences,
  updateExperience,
} from "@/app/dashboard/experience/action";
import { zodResolver } from "@hookform/resolvers/zod";

interface ExperienceProps {
  images: IImages[];
  initialData?: Experiences;
  redirectUrl: string;
}

export const ExperienceForm: React.FC<ExperienceProps> = ({
  images,
  initialData,
  redirectUrl,
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ExperiencesInsert>({
    resolver: zodResolver(experiencesInsertSchema),
    defaultValues: initialData ?? {
      userId: "1",
      title: "",
      company: "",
      imageUrl: "",
      description: "",
      isActive: true,
    },
  });

  async function onSubmit(values: ExperiencesInsert) {
    startTransition(async () => {
      try {
        if (initialData) {
          await updateExperience(initialData.id, values);
          toast.success("Experience updated successfully");
        } else {
          await insertExperiences(values);
          toast.success("Experience added successfully");
        }
        form.reset();
        router.push(redirectUrl);
      } catch (error) {
        console.log(error);
        toast.error(
          initialData
            ? "Failed to update experience"
            : "Failed to add experience"
        );
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="imageUrl"
            render={() => (
              <FormItem>
                <FormLabel>Company Logo</FormLabel>
                <FormControl>
                  <SingleImageSelector
                    control={form.control}
                    images={images}
                    name="imageUrl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your position" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Project description"
                    className="resize-none"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>End Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    Is this work entry currently active?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full h-12">
          <LoaderCircle
            className={cn("animate-spin size-4 hidden", {
              block: isPending,
            })}
          />
          {initialData ? "Update Experience" : "Add Experience"}
        </Button>
      </form>
    </Form>
  );
};
