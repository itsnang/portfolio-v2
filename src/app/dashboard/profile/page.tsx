import { ProfileForm } from "@/components/form/profile-form";
import React from "react";
import { getImages } from "../images/action";
import { getProfile } from "@/app/action";
import { getCurrentUser } from "@/lib/lucia/session";
import { redirect } from "next/navigation";

async function page() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  const images = await getImages();
  const profile = await getProfile();
  return (
    <section className="antialiased max-w-3xl space-y-16 border-gray-700 md:border-2 md:rounded-xl py-5 px-7 mx-auto md:my-[10vh]">
      <ProfileForm profile={profile} images={images} />
    </section>
  );
}

export default page;
