"use client";

import Image, { type StaticImageData } from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { Check, LoaderCircle, Save } from "lucide-react";
import { appConfigInsertSchema, AppConfigInsert } from "@/db/schema/app-config.schema";
import { updateAppConfigAction } from "@/server/actions/app-config";
import { AppConfig } from "@/db/table/app-config.table";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import modernPreview from "../../../public/theme-config/modern.jpg";
import wireframePreview from "../../../public/theme-config/wireframe.png";

interface AppConfigFormProps {
  config: AppConfig;
}

const THEME_OPTIONS: { value: AppConfigInsert["theme"]; label: string; src: StaticImageData; alt: string }[] = [
  { value: "modern", label: "Modern", src: modernPreview, alt: "Modern theme preview" },
  { value: "wireframe", label: "Wireframe", src: wireframePreview, alt: "Wireframe theme preview" },
];

export const AppConfigForm: React.FC<AppConfigFormProps> = ({ config }) => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<AppConfigInsert>({
    resolver: zodResolver(appConfigInsertSchema),
    defaultValues: {
      maintenance: config.maintenance,
      theme: config.theme,
    },
  });

  const { formState: { isDirty } } = form;

  const onSubmit = async (data: AppConfigInsert) => {
    setIsPending(true);
    try {
      const result = await updateAppConfigAction(data);
      if (result.success) {
        toast.success(result.message ?? "Config updated");
        form.reset(data);
      } else {
        toast.error(result.error ?? "Failed to update config");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>App Configuration</CardTitle>
            <CardDescription>
              Manage global settings for your portfolio.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="maintenance"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4">
                  <div>
                    <FormLabel>Maintenance Mode</FormLabel>
                    <FormDescription>
                      Show a maintenance banner to visitors.
                    </FormDescription>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <FormDescription>
                    Visual style for your portfolio.
                  </FormDescription>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      {THEME_OPTIONS.map((option) => {
                        const selected = field.value === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "relative rounded-xl border-2 overflow-hidden text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              selected
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-border hover:border-primary/40"
                            )}
                          >
                            <div className="pointer-events-none">
                              <Image src={option.src} alt={option.alt} className="w-full object-cover object-top" />
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-card">
                              <span className="text-sm font-medium">{option.label}</span>
                              <div className={cn(
                                "size-4 rounded-full border-2 flex items-center justify-center transition-colors",
                                selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                              )}>
                                {selected && <Check className="size-2.5 text-primary-foreground stroke-3" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isPending || !isDirty}>
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save Changes
        </Button>
      </form>
    </Form>
  );
};
