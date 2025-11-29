"use client";

import {
  projecInsertSchema,
  ProjectInsert,
  Project,
} from "@/db/schema/project.schema";
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
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ImageSelectionDialog } from "@/components/ui/image-selection-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LoaderCircle, Minus, Plus, Link2, Settings2 } from "lucide-react";
import { ImageSelector } from "@/components/image-selector";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createProjectAction,
  updateProjectAction,
} from "../../server/actions/project";
import { useRouter } from "next/navigation";

interface ProjectFormProps {
  images: IImages[];
  initialData?: Project;
  redirectUrl: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  images,
  initialData,
  redirectUrl,
}) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<ProjectInsert>({
    resolver: zodResolver(projecInsertSchema),
    defaultValues: initialData
      ? {
          profileId: String(initialData.profileId || ""),
          title: String(initialData.title || ""),
          thumbnail: String(initialData.thumbnail || ""),
          href: initialData.href ? String(initialData.href) : null,
          description: String(initialData.description || ""),
          isActive: Boolean(initialData.isActive ?? true),
          technologies:
            Array.isArray(initialData.technologies) &&
            initialData.technologies.length > 0
              ? (initialData.technologies as {
                  name: string;
                  logoUrl: string;
                }[])
              : [{ name: "", logoUrl: "" }],
          links:
            Array.isArray(initialData.links) && initialData.links.length > 0
              ? (initialData.links as { type: string; href: string }[])
              : [{ type: "", href: "" }],
          detailImage: Array.isArray(initialData.detailImage)
            ? (initialData.detailImage as string[])
            : undefined,
        }
      : {
          profileId: "",
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

  const watchTechnologies = form.watch("technologies");

  const onSubmit = async (data: ProjectInsert) => {
    setIsPending(true);
    try {
      // Filter out empty links (where both type and href are empty)
      const cleanedData = {
        ...data,
        links: data.links?.filter(
          (link) => link.type?.trim() || link.href?.trim()
        ),
      };

      let result;
      if (initialData && initialData.id) {
        result = await updateProjectAction(
          initialData.id as string,
          cleanedData
        );
      } else {
        result = await createProjectAction(cleanedData);
      }

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      form.reset();
      router.push(redirectUrl);
    } catch (error) {
      console.error("Project error:", error);
      toast.error(
        initialData
          ? "Failed to update project. Please try again."
          : "Failed to create project. Please try again."
      );
    } finally {
      setIsPending(false);
    }
  };

  const isFormValid = form.formState.isValid;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
                      className="whitespace-nowrap h-11"
                    />

                    <div className="flex gap-2">
                      {fields.length > 1 && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => remove(fieldIndex)}
                          className="text-destructive hover:text-destructive h-11"
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

          {/* Submit Section */}
          <Card className="shadow-sm border-2">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="sm:flex-1 h-12"
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
                      : "Creating..."
                    : initialData
                      ? "Update Project"
                      : "Create Project"}
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

export default ProjectForm;
