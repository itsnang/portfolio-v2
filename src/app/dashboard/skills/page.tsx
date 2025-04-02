import { SkillForm } from "@/components/form/skill-form";
import React from "react";
import { getImages } from "../images/action";
import { getCurrentUser } from "@/lib/lucia/session";
import { redirect } from "next/navigation";

async function SkillPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  const images = await getImages();
  return (
    <section className="antialiased max-w-3xl space-y-16 border-gray-700 md:border-2 md:rounded-xl py-5 px-7 mx-auto md:my-[10vh]">
      <SkillForm images={images} />
    </section>
  );
}

export default SkillPage;
