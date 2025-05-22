"use client";
import { useForm } from "react-hook-form";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { ImageSelector } from "../image-selector";
import { IImages, IProfile } from "@/types/profile.type";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import { ProfileInsert } from "@/db/schema/profile.schema";
import { updateProfileAction } from "@/app/dashboard/profile/action";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransition } from "react";

interface ProfileFormProps {
  images: IImages[];
  profile: IProfile;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  images,
  profile,
}) => {
  const [isPending, startTransition] = useTransition();
  const methods = useForm<ProfileInsert>({
    defaultValues: {
      name: profile.name,
      imageUrl: profile.imageUrl,
      bio: profile.bio,
      aboutImages: profile.aboutImages,
      abouts: profile.abouts,
      isAvailable: profile.isAvailable,
    },
  });
  const onSubmit = async (data: ProfileInsert) => {
    startTransition(async () => {
      try {
        await updateProfileAction(data);
        toast.success("Update Profile successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update profile");
      }
    });
  };
  return (
    <Form {...methods}>
      <form className="space-y-3" onSubmit={methods.handleSubmit(onSubmit)}>
        {/* switcher */}
        <FormField
          control={methods.control}
          name="isAvailable"
          render={({ field }) => (
            <div className="flex items-center justify-end space-x-2">
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="airplane-mode"
              />
              <Label htmlFor="airplane-mode">Available for work</Label>
            </div>
          )}
        />

        {/* profile */}
        <ImageSelector
          control={methods.control}
          images={images}
          name="imageUrl"
          mode="single"
          aspectRatio="video"
        />
        <div className="space-y-1">
          <Label className="ml-1 text-sm font-medium" htmlFor="name">
            Name
          </Label>
          <Input
            className="h-12"
            id="name"
            placeholder="Name"
            {...methods.register("name")}
          />
        </div>
        <div className="space-y-1">
          <Label className="ml-1 text-sm font-medium" htmlFor="bio">
            Bio
          </Label>
          <Input
            className="h-12"
            id="bio"
            placeholder="Bio"
            {...methods.register("bio")}
          />
        </div>
        <div className="space-y-1">
          <Label className="ml-1 text-sm font-medium" htmlFor="abouts">
            Abouts
          </Label>
          <Textarea {...methods.register("abouts")} placeholder="Abouts" />
        </div>
        <ImageSelector
          control={methods.control}
          images={images}
          name="aboutImages"
          mode="multiple"
          aspectRatio="portrait"
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
