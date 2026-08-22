import { ProfileForm } from "@/features/profile/components/profile-form";
import React from "react";
import { getProfile } from "@/features/profile/actions";

export const revalidate = 0;

async function page() {
  const profile = await getProfile();

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <ProfileForm profile={profile} />
    </section>
  );
}

export default page;
