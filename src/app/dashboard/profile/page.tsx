import { ProfileForm } from "@/components/profile/profile-form";
import React from "react";
import { getImages } from "../images/action";
import { getProfile } from "@/app/action";

async function page() {
  const images = await getImages();
  const profile = await getProfile();
  return (
    <section className="antialiased max-w-3xl space-y-16 border-gray-700 md:border-2 md:rounded-xl py-5 px-7 mx-auto md:my-[10vh]">
      <ProfileForm profile={profile} images={images} />
    </section>
  );
}

export default page;
