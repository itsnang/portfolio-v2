import { ProjectTable } from "@/features/project/components/project-table";
import { getProjects } from "@/features/project/admin-queries";

async function ProjectPage() {
  const projects = await getProjects();

  return <ProjectTable projects={projects} />;
}

export default ProjectPage;
