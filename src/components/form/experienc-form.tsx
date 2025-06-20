"use client";

import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  CalendarIcon,
  LoaderCircle,
  Building2,
  User,
  FileText,
  Calendar as CalendarLucide,
  ImageIcon,
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ImageSelector } from "../image-selector";
import { IImages } from "@/types/profile.type";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  ExperiencesInsert,
  experiencesInsertSchema,
  Experiences,
} from "@/db/schema/experiences.schema";
import { cn } from "@/lib/utils";
import {
  insertExperiences,
  updateExperience,
} from "@/app/dashboard/experience/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextEditor } from "../ui/editor";

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
  const [isPending, setIsPending] = useState(false);
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
    setIsPending(true);
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
        initialData ? "Failed to update experience" : "Failed to add experience"
      );
    }
    setIsPending(false);
  }

  const isFormValid = form.formState.isValid;
  const watchedStartDate = form.watch("startDate");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {initialData ? "Edit Experience" : "Add New Experience"}
        </h1>
        <p className="text-muted-foreground">
          {initialData
            ? "Update your work experience details below"
            : "Fill in the details of your work experience"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Information Section */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="h-5 w-5 text-primary" />
                Company Information
              </CardTitle>
              <CardDescription>
                Details about the company and your role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Company Logo
                    </FormLabel>
                    <FormControl>
                      <ImageSelector
                        control={form.control}
                        images={images}
                        name="imageUrl"
                        mode="single"
                        aspectRatio="video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Position/Role
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Senior Software Engineer"
                          className="h-11"
                          {...field}
                        />
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
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Tech Corporation Inc."
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Description Section */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 text-primary" />
                Job Description
              </CardTitle>
              <CardDescription>
                Describe your responsibilities, achievements, and key
                contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="border rounded-lg overflow-hidden">
                        <RichTextEditor
                          content={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Share your key responsibilities, notable achievements, technologies used, and impact made in this role..."
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Use bullet points, bold text, and formatting to make your
                      experience stand out
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Timeline Section */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarLucide className="h-5 w-5 text-primary" />
                Employment Timeline
              </CardTitle>
              <CardDescription>
                Specify the duration of your employment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-11 pl-3 text-left font-normal justify-start",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select start date</span>
                              )}
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
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-11 pl-3 text-left font-normal justify-start",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select end date or leave blank</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date();
                              const startDate = watchedStartDate;
                              return (
                                date > today ||
                                date < new Date("1900-01-01") ||
                                (startDate && date < startDate)
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Leave empty if this is your current position
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-3 space-y-0 rounded-lg border p-4 bg-muted/20">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </FormControl>
                      <div className="flex-1 space-y-1">
                        <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Current Position
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Check this if you are currently working in this role
                        </FormDescription>
                      </div>
                      {field.value && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card className="shadow-sm border-2">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="sm:flex-1"
                  onClick={() => router.push(redirectUrl)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="sm:flex-1 h-12 relative"
                  disabled={isPending || !isFormValid}
                >
                  {isPending && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isPending
                    ? initialData
                      ? "Updating..."
                      : "Adding..."
                    : initialData
                      ? "Update Experience"
                      : "Add Experience"}
                </Button>
              </div>

              {!isFormValid && (
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Please fill in all required fields to continue
                </p>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};
