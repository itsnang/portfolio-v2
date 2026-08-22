import { ProjectTable } from "@/features/project/components/project-table";
import { getProjects } from "@/features/project/actions";
import { getImages } from "@/features/media/actions";

async function ProjectPage() {
  const [images, projects] = await Promise.all([getImages(), getProjects()]);

  return (
    <section className="antialiased max-w-5xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <ProjectTable projects={projects} images={images} />
    </section>
  );
}

export default ProjectPage;
