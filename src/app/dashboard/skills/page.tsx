import { SkillForm } from "@/components/form/skill-form";
import React from "react";
import { getImages } from "../images/action";
import {} from "@/lib/lucia/session";

async function SkillPage() {
  const images = await getImages();
  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <SkillForm images={images} />
    </section>
  );
}

export default SkillPage;
