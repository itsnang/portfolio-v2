"use client";

import {
  EducationInsert,
  educationInsertSchema,
} from "@/db/schema/education.schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";

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
import { insertEducation } from "@/app/dashboard/education/action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EducationFormProps {
  images: IImages[];
}

export const EducationForm: React.FC<EducationFormProps> = ({ images }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<EducationInsert>({
    resolver: zodResolver(educationInsertSchema),
    defaultValues: {
      school: "",
      degree: "",
      logoUrl: "",
      href: "",
      isActive: true,
    },
  });
  async function onSubmit(values: EducationInsert) {
    startTransition(async () => {
      try {
        await insertEducation({
          ...values,
          userId: "1",
        });
        toast.success("Insert Education successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to Insert Education");
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <SingleImageSelector
          control={form.control}
          images={images}
          name="logoUrl"
        />

        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School</FormLabel>
              <FormControl>
                <Input placeholder="Enter school name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="degree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <FormControl>
                <Input placeholder="Enter degree" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="href"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter website URL"
                  value={field.value || ""}
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
                  Is this education entry currently active?
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
