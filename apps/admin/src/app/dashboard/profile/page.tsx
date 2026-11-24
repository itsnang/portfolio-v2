import { ProfileForm } from "@/features/profile/components/profile-form";
import React from "react";
import { getEditableProfile } from "@/features/profile/admin-queries";

export const revalidate = 0;

async function page() {
  const profile = await getEditableProfile();

  return <ProfileForm profile={profile} />;
}

export default page;
