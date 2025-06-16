"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "../ui/switch";
import { ImageSelector } from "../image-selector";
import { IImages, IProfile } from "@/types/profile.type";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { ProfileInsert, profileInsertSchema } from "@/db/schema/profile.schema";
import { updateProfileAction } from "@/app/dashboard/profile/action";
import { toast } from "sonner";
import { LoaderCircle, Save, FileText, Image as ImageIcon } from "lucide-react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

interface ProfileFormProps {
  images: IImages[];
  profile: IProfile;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  images,
  profile,
}) => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ProfileInsert>({
    resolver: zodResolver(profileInsertSchema),
    defaultValues: {
      name: profile.name || "",
      imageUrl: profile.imageUrl || "",
      bio: profile.bio || "",
      aboutImages: profile.aboutImages || [],
      abouts: profile.abouts || "",
      isAvailable: profile.isAvailable ?? true,
    },
    mode: "onChange",
  });

  const {
    formState: { errors, isDirty, isValid },
  } = form;

  const onSubmit = async (data: ProfileInsert) => {
    if (!isValid) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsPending(true);
    try {
      await updateProfileAction(data);
      toast.success("Profile updated successfully!");
      form.reset(data);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleFormReset = () => {
    form.reset({
      name: profile.name || "",
      imageUrl: profile.imageUrl || "",
      bio: profile.bio || "",
      aboutImages: profile.aboutImages || [],
      abouts: profile.abouts || "",
      isAvailable: profile.isAvailable ?? true,
    });
    toast.info("Form reset to original values");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage personal information and availability status.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Availability Section */}
          <Card>
            <CardHeader>
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center justify-between space-x-3">
                        <FormLabel
                          htmlFor="availability-toggle"
                          className="text-sm font-medium cursor-pointer"
                        >
                          Available for work
                        </FormLabel>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="availability-toggle"
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardHeader>
          </Card>

          {/* Profile Image Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Profile Image
              </CardTitle>
              <CardDescription>Choose profile image</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="imageUrl"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <ImageSelector
                        control={form.control}
                        images={images}
                        name="imageUrl"
                        mode="single"
                        aspectRatio="video"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your full name"
                          className="h-12"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          placeholder="Brief description about yourself"
                          className="h-12"
                          disabled={isPending}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="abouts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Me *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell visitors about your background, skills, and interests..."
                        className="min-h-[120px] resize-none"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* About Images Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="aboutImages"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <ImageSelector
                        control={form.control}
                        images={images}
                        name="aboutImages"
                        mode="multiple"
                        aspectRatio="portrait"
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>Select multiple images</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Separator />

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleFormReset}
              disabled={isPending || !isDirty}
              className="h-12 sm:w-auto"
            >
              Reset Changes
            </Button>
            <Button
              type="submit"
              disabled={isPending || !isDirty || !isValid}
              className="h-12 sm:w-auto min-w-[140px]"
            >
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin size-4 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Form Status */}
          {Object.keys(errors).length > 0 && (
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-2">
                <span>Please fix the following errors:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-destructive/80">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    <span className="capitalize">{field}:</span>{" "}
                    {error?.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
