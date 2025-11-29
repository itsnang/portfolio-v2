import { ProjectTable } from "@/components/project-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getProjects } from "@/server/actions/project";

async function ProjectPage() {
  const projects = await getProjects();

  return (
    <section className="antialiased max-w-5xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <Link href="/dashboard/project/create">
            <PlusIcon className="h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>

      <ProjectTable projects={projects} />
    </section>
  );
}

export default ProjectPage;
