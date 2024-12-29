"use client";
import { SkillsInsert, skillsInsertSchema } from "@/db/schema/skills.schma";
import { IImages } from "@/types/profile.type";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import SingleImageSelector from "../single-image-selector";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSkill } from "@/app/dashboard/skills/action";

interface SkillFormProps {
  images: IImages[];
}

export const SkillForm: React.FC<SkillFormProps> = ({ images }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SkillsInsert>({
    resolver: zodResolver(skillsInsertSchema),
    defaultValues: {
      userId: "1",
      name: "",
      logoUrl: "",
      isActive: true,
    },
  });
  async function onSubmit(values: SkillsInsert) {
    startTransition(async () => {
      try {
        console.log(values);
        await insertSkill(values);
        toast.success("Insert Skill successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to Insert Skill");
      }
    });
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
                <SingleImageSelector
                  control={form.control}
                  images={images}
                  name="logoUrl"
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
                  Is this skill entry currently active?
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
