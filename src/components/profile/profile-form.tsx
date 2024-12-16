"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import SingleImageSelector from "../single-image-selector";
import { IImages } from "@/types/profile.type";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ImageSelector } from "../multi-image-selector";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";

interface ProfileFormProps {
  images: IImages[];
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ images }) => {
  const methods = useForm();
  const onSubmit = (data: unknown) => console.log(data);
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
        <SingleImageSelector
          control={methods.control}
          images={images}
          name="imageUrl"
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
        />
        <Button type="submit" className="w-full h-12">
          Submit
        </Button>
      </form>
    </Form>
  );
};
