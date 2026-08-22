"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Image as ImageIcon,
  LoaderCircle,
  Quote,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ImageSelector } from "@/components/image-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createRecommendationAction,
  updateRecommendationAction,
} from "@/features/recommendations/actions";
import {
  recommendationsFormSchema,
  type Recommendations,
  type RecommendationsFormValues,
} from "@/features/recommendations/schemas";
import { cn } from "@/lib/utils";
import { IImages } from "@/types/profile.type";

interface RecommendationsFormProps {
  images: IImages[];
  initialValues?: Recommendations;
  onSuccess?: () => void;
}

export const RecommendationsForm: React.FC<RecommendationsFormProps> = ({
  images,
  initialValues,
  onSuccess,
}) => {
  const [isPending, setIsPending] = useState(false);
  const isEditing = Boolean(initialValues);

  const form = useForm<RecommendationsFormValues>({
    resolver: zodResolver(recommendationsFormSchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          position: initialValues.position,
          profileImageUrl: initialValues.profileImageUrl,
          recommendationText: initialValues.recommendationText,
          isActive: initialValues.isActive ?? true,
        }
      : {
          name: "",
          position: "",
          profileImageUrl: "",
          recommendationText: "",
          isActive: true,
        },
  });

  async function handleSubmit(values: RecommendationsFormValues) {
    setIsPending(true);
    try {
      const result = isEditing
        ? await updateRecommendationAction(initialValues!.id, values)
        : await createRecommendationAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(
        isEditing ? "Recommendation updated" : "Recommendation added successfully"
      );
      if (!isEditing) form.reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(
        isEditing
          ? "Failed to update recommendation"
          : "Failed to add recommendation"
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ImageIcon className="h-5 w-5 text-primary" />
              Profile Image
            </CardTitle>
            <CardDescription>
              Select a profile image for the person providing the
              recommendation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageSelector
              control={form.control}
              images={images}
              name="profileImageUrl"
              mode="single"
              aspectRatio="video"
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Details about the person providing the recommendation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. John Smith"
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
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Position/Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Senior Engineering Manager"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Quote className="h-5 w-5 text-primary" />
              Recommendation
            </CardTitle>
            <CardDescription>
              The recommendation text from your colleague or manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="recommendationText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommendation Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write the recommendation text here..."
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share what they said about your work, skills, and
                    contributions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-6 bg-muted/20">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-base font-medium">
                      Active Recommendation
                    </FormLabel>
                    <FormDescription>
                      Display this recommendation on your portfolio
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-32">
            <LoaderCircle
              className={cn("animate-spin size-4 hidden", {
                block: isPending,
              })}
            />
            {isEditing ? "Save Changes" : "Add Recommendation"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
