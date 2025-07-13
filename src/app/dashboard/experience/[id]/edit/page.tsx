import React from "react";
import { getImages } from "@/app/dashboard/images/action";
import { getExperienceById } from "../../action";
import {} from "@/lib/lucia/session";
import { redirect } from "next/navigation";
import { ExperienceForm } from "@/components/form/experienc-form";

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({
  params,
}: EditExperiencePageProps) {
  const { id } = await params;
  const experience = await getExperienceById(id);
  if (!experience) redirect("/dashboard/experience");
  const images = await getImages();
  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Experience</h1>
      <ExperienceForm
        images={images}
        initialData={experience}
        redirectUrl="/dashboard/experience"
      />
    </section>
  );
}
