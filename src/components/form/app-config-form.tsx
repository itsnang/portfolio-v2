"use client";

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

interface AppConfigFormProps {
  config: AppConfig;
}

function ModernPreview() {
  return (
    <div style={{ background: "#0d0d12", padding: "10px 10px 8px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ width: 14, height: 8, background: "#6366f1", borderRadius: 2 }} />
        <div style={{ display: "flex", gap: 4 }}>
          {[30, 24, 28, 22].map((w, i) => (
            <div key={i} style={{ width: w, height: 4, background: "#2d2d3a", borderRadius: 2 }} />
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 8, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ width: "40%", height: 4, background: "#6366f1", borderRadius: 2 }} />
          <div style={{ height: 9, background: "#e5e7eb", borderRadius: 2 }} />
          <div style={{ width: "70%", height: 9, background: "#e5e7eb", borderRadius: 2 }} />
          <div style={{ height: 3, background: "#4b5563", borderRadius: 2, marginTop: 1 }} />
          <div style={{ height: 3, width: "80%", background: "#4b5563", borderRadius: 2 }} />
          <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
            <div style={{ width: 30, height: 6, background: "#6366f1", borderRadius: 2 }} />
            <div style={{ width: 24, height: 6, background: "#1f2937", borderRadius: 2, border: "1px solid #374151" }} />
          </div>
        </div>
        <div style={{ background: "#1a1a24", borderRadius: 4, height: 52 }} />
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, height: 3, background: "#1f2937", borderRadius: 2 }} />
        ))}
      </div>
    </div>
  );
}

function WireframePreview() {
  return (
    <div style={{ background: "#fbfaf5", padding: "10px 10px 8px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1.5px solid #25252a", paddingBottom: 5, marginBottom: 2 }}>
        <div style={{ width: 10, height: 8, background: "#25252a" }} />
        <div style={{ display: "flex", gap: 4 }}>
          {[28, 22, 26, 20].map((w, i) => (
            <div key={i} style={{ width: w, height: 3, background: "#25252a", opacity: 0.5 }} />
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 8, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ width: "35%", height: 3, background: "#6b6b40", borderRadius: 1 }} />
          <div style={{ height: 9, background: "#25252a", borderRadius: 1 }} />
          <div style={{ width: "65%", height: 9, background: "#25252a", borderRadius: 1 }} />
          <div style={{ height: 3, width: "85%", background: "#6b6b50", opacity: 0.6 }} />
          <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
            <div style={{ width: 28, height: 6, background: "#25252a" }} />
            <div style={{ width: 22, height: 6, border: "1.5px solid #25252a" }} />
          </div>
        </div>
        <div style={{ border: "1.5px solid #25252a", height: 52, background: "#ede9de" }} />
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, height: 6, background: "#ede9de", border: "1px solid #c8c3b0" }} />
        ))}
      </div>
    </div>
  );
}

const THEME_OPTIONS: { value: AppConfigInsert["theme"]; label: string; preview: React.ReactNode }[] = [
  { value: "modern", label: "Modern", preview: <ModernPreview /> },
  { value: "wireframe", label: "Wireframe", preview: <WireframePreview /> },
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
                              {option.preview}
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
