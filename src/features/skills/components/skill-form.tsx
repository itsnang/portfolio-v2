"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createSkillAction, updateSkillAction } from "@/features/skills/actions";
import {
  skillsFormSchema,
  type Skills,
  type SkillsFormValues,
} from "@/features/skills/schemas";
import { skillCategoryEnum } from "@/db/table";
import { cn } from "@/lib/utils";
import { IImages } from "@/types/profile.type";
import { ImageSelector } from "@/components/image-selector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SkillFormProps {
  images: IImages[];
  initialValues?: Skills;
  onSuccess?: () => void;
}

export const SkillForm: React.FC<SkillFormProps> = ({
  images,
  initialValues,
  onSuccess,
}) => {
  const [isPending, setIsPending] = useState(false);
  const isEditing = Boolean(initialValues);

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          logoUrl: initialValues.logoUrl,
          isActive: initialValues.isActive ?? true,
          category: initialValues.category,
        }
      : {
          name: "",
          logoUrl: "",
          isActive: true,
          category: "Frontend",
        },
  });

  async function onSubmit(values: SkillsFormValues) {
    setIsPending(true);
    try {
      const result = isEditing
        ? await updateSkillAction(initialValues!.id, values)
        : await createSkillAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditing ? "Skill updated" : "Skill added");
      if (!isEditing) form.reset();
      onSuccess?.();
    } catch (error) {
      console.log(error);
      toast.error(isEditing ? "Failed to update skill" : "Failed to add skill");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="logoUrl"
          render={({}) => (
            <FormItem>
              <FormLabel>Skill Logo</FormLabel>
              <FormControl>
                <ImageSelector
                  control={form.control}
                  images={images}
                  name="logoUrl"
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
              <FormLabel>Skill name</FormLabel>
              <FormControl>
                <Input placeholder="Enter skill name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {skillCategoryEnum.enumValues.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12" disabled={isPending}>
          <LoaderCircle
            className={cn("animate-spin size-4 hidden", {
              block: isPending,
            })}
          />
          {isEditing ? "Save Changes" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
