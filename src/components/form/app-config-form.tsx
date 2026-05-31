"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AppConfigFormProps {
  config: AppConfig;
}

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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="wireframe">Wireframe</SelectItem>
                    </SelectContent>
                  </Select>
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
