"use client";

import { ProfileForm } from "./profile-form";
import { IImages, IProfile } from "@/types/profile.type";

interface ProfileFormWrapperProps {
  images: IImages[];
  profile: IProfile;
}

export const ProfileFormWrapper: React.FC<ProfileFormWrapperProps> = ({
  images,
  profile,
}) => {
  return <ProfileForm images={images} profile={profile} />;
};
