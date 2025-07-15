import { ProfileForm } from "@/components/form/profile-form";
import React from "react";
import { getImages } from "../images/action";
import { getProfile } from "@/app/action";

export const revalidate = 0;

async function page() {
  const images = await getImages();
  const profile = await getProfile();

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <ProfileForm profile={profile} images={images} />
    </section>
  );
}

export default page;
