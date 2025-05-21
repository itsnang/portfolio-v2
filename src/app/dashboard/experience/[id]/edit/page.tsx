import React from "react";
import { getImages } from "@/app/dashboard/images/action";
import { getExperienceById } from "../../action";
import { getCurrentUser } from "@/lib/lucia/session";
import { redirect } from "next/navigation";
import { ExperienceFormWrapper } from "@/components/form/experience-form-wrapper";

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({
  params,
}: EditExperiencePageProps) {
  const user = await getCurrentUser();
  const { id } = await params;
  if (!user) redirect("/sign-in");
  const experience = await getExperienceById(id);
  if (!experience) redirect("/dashboard/experience");
  const images = await getImages();
  return (
    <section className="antialiased max-w-2xl border-gray-700 md:border-2 md:rounded-xl py-5 px-7 mx-auto md:my-[10vh]">
      <h1 className="text-2xl font-bold mb-6">Edit Experience</h1>
      <ExperienceFormWrapper
        images={images}
        initialData={experience}
        redirectUrl="/dashboard/experience"
      />
    </section>
  );
}
