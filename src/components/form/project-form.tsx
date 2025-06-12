"use client";

import { projecInsertSchema, ProjectInsert } from "@/db/schema/project.schema";
import { IImages } from "@/types/profile.type";
import React, { useState } from "react";
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
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { ImageSelectionDialog } from "../ui/image-selection-dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { LoaderCircle, Minus, Plus, Link2, Settings2 } from "lucide-react";
import { ImageSelector } from "../image-selector";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProject } from "@/app/dashboard/project/action";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

interface ProjectFormProps {
  images: IImages[];
}

const ProjectForm: React.FC<ProjectFormProps> = ({ images }) => {
  const [isPending, setIsPending] = useState(false);

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
  const onSubmit = async (data: ProjectInsert) => {
    setIsPending(true);
    try {
      await insertProject(data);
      console.log(data);
      toast.success("Create Project successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Create Project.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Project
        </h1>
        <p className="text-muted-foreground">
          Add a new project to your portfolio with details, technologies, and
          images.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Project Thumbnail Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                Project Thumbnail
              </CardTitle>
              <CardDescription>
                Choose a thumbnail image that best represents your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageSelector
                control={form.control}
                images={images}
                name="thumbnail"
                mode="single"
                aspectRatio="video"
              />
            </CardContent>
          </Card>

          {/* Basic Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the essential details about your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          className="h-12"
                          placeholder="Enter project name"
                          {...field}
                        />
                      </FormControl>
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
                          className="h-12"
                          placeholder="https://your-project.com"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project, its purpose, and key features..."
                        className="resize-none min-h-[120px]"
                        {...field}
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-6 bg-muted/20">
                    <FormControl>
                      <Checkbox
                        checked={field.value || undefined}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-medium">
                        Active Project
                      </FormLabel>
                      <FormDescription>
                        Display this project in your portfolio. Inactive
                        projects won&apos;t be shown to visitors.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Technologies Section */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies Used</CardTitle>
              <CardDescription>
                Add the technologies, frameworks, and tools used in this project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, fieldIndex) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg bg-muted/20 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        {...form.register(
                          `technologies.${fieldIndex}.name` as const,
                          {
                            required: "Technology name is required",
                          }
                        )}
                        placeholder="e.g., React, Node.js, PostgreSQL"
                        className="h-11"
                      />
                    </div>

                    {watchTechnologies[fieldIndex]?.logoUrl && (
                      <div className="flex items-center justify-center w-12 h-12 border rounded-lg bg-background">
                        <Image
                          src={watchTechnologies[fieldIndex].logoUrl}
                          alt={`${watchTechnologies[fieldIndex].name} logo`}
                          className="w-8 h-8 object-contain"
                          width={32}
                          height={32}
                        />
                      </div>
                    )}

                    <ImageSelectionDialog
                      images={images}
                      onSelect={(url) =>
                        form.setValue(`technologies.${fieldIndex}.logoUrl`, url)
                      }
                      triggerText="Choose Logo"
                      className="whitespace-nowrap"
                    />

                    <div className="flex gap-2">
                      {fields.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => remove(fieldIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                type="button"
                onClick={() => append({ logoUrl: "", name: "" })}
                className="w-full h-11 border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Technology
              </Button>
            </CardContent>
          </Card>

          {/* Links Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5" />
                Project Links
              </CardTitle>
              <CardDescription>
                Add relevant links such as GitHub repository, live demo,
                documentation, etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {linkFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg bg-muted/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      {...form.register(`links.${index}.type` as const)}
                      placeholder="e.g., GitHub, Live Demo, Documentation"
                      className="h-11"
                    />
                    <div className="flex gap-2">
                      <Input
                        {...form.register(`links.${index}.href` as const)}
                        placeholder="https://..."
                        className="h-11 flex-1"
                      />
                      {linkFields.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => removeLink(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                type="button"
                onClick={() => appendLink({ type: "", href: "" })}
                className="w-full h-11 border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </CardContent>
          </Card>

          {/* Detail Images Section */}
          <Card>
            <CardHeader>
              <CardTitle>Project Gallery</CardTitle>
              <CardDescription>
                Upload additional images to showcase your project in detail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageSelector
                control={form.control}
                images={images}
                mode="multiple"
                name="detailImage"
              />
            </CardContent>
          </Card>

          <Separator />

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto min-w-[200px] h-12 text-base font-medium"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
                  Creating Project...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectForm;
