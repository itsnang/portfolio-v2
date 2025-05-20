"use client";

import { ProfileFormWrapper } from "@/components/form/profile-form-wrapper";
import { IImages, IProfile } from "@/types/profile.type";

interface ProfilePageClientProps {
  profile: IProfile;
  images: IImages[];
}

export const ProfilePageClient = ({
  profile,
  images,
}: ProfilePageClientProps) => {
  return (
    <section className="antialiased max-w-3xl space-y-16 border-gray-700 md:border-2 md:rounded-xl py-5 px-7 mx-auto md:my-[10vh]">
      <ProfileFormWrapper profile={profile} images={images} />
    </section>
  );
};
