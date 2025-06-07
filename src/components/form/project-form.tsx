"use client";

import { projecInsertSchema, ProjectInsert } from "@/db/schema/project.schema";
import { IImages } from "@/types/profile.type";
import React, { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { ImageSelectionDialog } from "../ui/image-selection-dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { LoaderCircle, Minus, Plus } from "lucide-react";
import { ImageSelector } from "../image-selector";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { insertProject } from "@/app/dashboard/project/action";

interface ProjectFormProps {
  images: IImages[];
}

const ProjectForm: React.FC<ProjectFormProps> = ({ images }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProjectInsert>({
    resolver: zodResolver(projecInsertSchema),
    defaultValues: {
      profileId: "1",
      title: "",
      thumbnail: "",
      href: null,
      description: "",
      isActive: true,
      technologies: [{ name: "", logoUrl: "" }],
      links: [{ type: "", href: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "technologies",
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control: form.control,
    name: "links",
  });

  console.log(form.formState.errors);

  const watchTechnologies = form.watch("technologies");
  const onSubmit = (data: ProjectInsert) => {
    startTransition(async () => {
      try {
        await insertProject(data);
        console.log(data);
        toast.success("Create Project successfully.");
      } catch (error) {
        console.log(error);
        toast.error("Failed to Create Project.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ImageSelector
          control={form.control}
          images={images}
          name="thumbnail"
          mode="single"
          aspectRatio="video"
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input
                  className="h12"
                  placeholder="Enter project name"
                  {...field}
                />
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
              <FormLabel>Project Link</FormLabel>
              <FormControl>
                <Input
                  className="h12"
                  placeholder="Enter project link"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
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
                  Is this project entry currently active?
                </FormDescription>
              </div>
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
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          {fields.map((field, fieldIndex) => (
            <div key={field.id} className="flex items-center space-x-2 mt-2">
              <Input
                {...form.register(`technologies.${fieldIndex}.name` as const, {
                  required: "Name is required",
                })}
                placeholder="Technology Name"
                className="grow"
              />
              {watchTechnologies[fieldIndex]?.logoUrl && (
                <Image
                  src={watchTechnologies[fieldIndex].logoUrl}
                  alt={`${watchTechnologies[fieldIndex].name} logo`}
                  className="w-8 h-8 object-contain"
                  width={32}
                  height={32}
                />
              )}
              <ImageSelectionDialog
                images={images}
                onSelect={(url) =>
                  form.setValue(`technologies.${fieldIndex}.logoUrl`, url)
                }
                triggerText="Choose Logo"
                className="whitespace-nowrap"
              />

              <Button
                variant={"secondary"}
                type="button"
                onClick={() => remove(fieldIndex)}
              >
                <Minus />
              </Button>
              <Button
                variant={"secondary"}
                type="button"
                onClick={() =>
                  append({
                    logoUrl: "",
                    name: "",
                  })
                }
              >
                <Plus />
              </Button>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Links
          </label>
          {linkFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mt-2">
              <Input
                {...form.register(`links.${index}.type` as const)}
                placeholder="Type"
              />
              <Input
                {...form.register(`links.${index}.href` as const)}
                placeholder="URL"
              />
              <Button
                variant={"secondary"}
                type="button"
                onClick={() => removeLink(index)}
              >
                <Minus />
              </Button>
              <Button
                variant={"secondary"}
                type="button"
                onClick={() => appendLink({ type: "", href: "" })}
              >
                <Plus />
              </Button>
            </div>
          ))}
        </div>

        <ImageSelector
          control={form.control}
          images={images}
          name="detailImage"
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

export default ProjectForm;
