import { EducationForm } from "@/components/form/education-form";
import React from "react";
import { getImages } from "../images/action";
import { getCurrentUser } from "@/lib/lucia/session";
import { redirect } from "next/navigation";

async function EducationPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  const images = await getImages();

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <EducationForm images={images} />
    </section>
  );
}

export default EducationPage;
