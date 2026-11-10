"use client";

import React, { useRef, useTransition } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoaderCircle, FileText, ImageIcon, Send } from "lucide-react";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageSelector } from "@/features/media/components/image-selector";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

import {
  blogPostInsertSchema,
  BlogPostInsert,
  BlogPost,
} from "@/features/blog/schemas";
import { blogStatusEnum, blogCategoryEnum } from "@/db/table";
import { IImages } from "@/features/media/types";
import { slugify } from "@/utils/slugify";
import {
  createBlogPostAction,
  updateBlogPostAction,
} from "@/features/blog/actions";

interface BlogFormProps {
  images: IImages[];
  initialData?: BlogPost;
  onSuccess?: () => void;
}

const getDefaultValues = (initialData?: BlogPost): BlogPostInsert => {
  if (!initialData) {
    return {
      title: "",
      slug: "",
      excerpt: "",
      coverImage: undefined,
      content: "",
      status: "draft",
      category: "engineering",
    };
  }

  return {
    title: String(initialData.title || ""),
    slug: String(initialData.slug || ""),
    excerpt: String(initialData.excerpt || ""),
    coverImage: initialData.coverImage ? String(initialData.coverImage) : undefined,
    content: String(initialData.content || ""),
    status: initialData.status,
    category: initialData.category,
  };
};

const CoverImageCard = ({ images }: { images: IImages[] }) => {
  const { control } = useFormContext<BlogPostInsert>();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Cover Image
        </CardTitle>
        <CardDescription>
          Optional — shown on the blog index and as the link preview image
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ImageSelector
          control={control}
          images={images}
          name="coverImage"
          mode="single"
          aspectRatio="video"
        />
      </CardContent>
    </Card>
  );
};

const BasicInfoCard = ({ isEditing }: { isEditing: boolean }) => {
  const { control, setValue, getValues } = useFormContext<BlogPostInsert>();
  const slugEditedRef = useRef(isEditing);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className="h-12"
                  placeholder="Enter post title"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!slugEditedRef.current) {
                      setValue("slug", slugify(e.target.value), {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  className="h-12 font-mono text-sm"
                  placeholder="post-url-slug"
                  {...field}
                  onChange={(e) => {
                    slugEditedRef.current = true;
                    field.onChange(e);
                  }}
                  onBlur={() => {
                    const current = getValues("slug");
                    if (current) setValue("slug", slugify(current));
                  }}
                />
              </FormControl>
              <FormDescription>
                The post will live at /blog/{getValues("slug") || "your-slug"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short summary shown on the blog index and in link previews..."
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

const ContentCard = () => {
  const { control } = useFormContext<BlogPostInsert>();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SimpleEditor
                  content={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Write your post..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

const PublishCard = () => {
  const { control } = useFormContext<BlogPostInsert>();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Publish
        </CardTitle>
        <CardDescription>
          Draft posts are only visible in this dashboard. Once published, the
          publish date is fixed and won&apos;t change on future edits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {blogCategoryEnum.enumValues.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {blogStatusEnum.enumValues.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "draft" ? "Draft" : "Published"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

const BlogForm: React.FC<BlogFormProps> = ({
  images,
  initialData,
  onSuccess,
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<BlogPostInsert>({
    resolver: zodResolver(blogPostInsertSchema),
    defaultValues: getDefaultValues(initialData),
  });

  const onSubmit = (data: BlogPostInsert) => {
    startTransition(async () => {
      try {
        const result = initialData?.id
          ? await updateBlogPostAction(initialData.id, data)
          : await createBlogPostAction(data);

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        toast.success(result.message);
        form.reset();
        onSuccess?.();
      } catch (error) {
        console.error("Blog post error:", error);
        toast.error(
          initialData
            ? "Failed to update blog post. Please try again."
            : "Failed to create blog post. Please try again."
        );
      }
    });
  };

  const isFormValid = form.formState.isValid;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <BasicInfoCard isEditing={Boolean(initialData)} />
          <CoverImageCard images={images} />
          <ContentCard />
          <PublishCard />

          <Card className="shadow-sm border-2">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="sm:flex-1 h-12"
                  onClick={() => onSuccess?.()}
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
                      ? "Update Post"
                      : "Create Post"}
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

export default BlogForm;
