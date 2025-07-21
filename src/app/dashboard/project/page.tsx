import React from "react";
import { getImages } from "../images/action";
import ProjectForm from "@/components/form/project-form";

async function ProjectFormPage() {
  const image = await getImages();
  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <ProjectForm images={image} />
    </section>
  );
}

export default ProjectFormPage;
