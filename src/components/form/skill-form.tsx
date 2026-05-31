"use client";
import { insertSkill } from "@/app/dashboard/skills/action";
import { SkillsInsert, skillsInsertSchema } from "@/db/schema/skills.schma";
import { skillCategoryEnum } from "@/db/table";
import { cn } from "@/lib/utils";
import { IImages } from "@/types/profile.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImageSelector } from "../image-selector";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SkillFormProps {
  images: IImages[];
}

export const SkillForm: React.FC<SkillFormProps> = ({ images }) => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<SkillsInsert>({
    resolver: zodResolver(skillsInsertSchema),
    defaultValues: {
      userId: "1",
      name: "",
      logoUrl: "",
      isActive: true,
      category: "Frontend",
    },
  });

  async function onSubmit(values: SkillsInsert) {
    setIsPending(true);
    try {
      await insertSkill(values);
      toast.success("Insert Skill successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Insert Skill");
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
