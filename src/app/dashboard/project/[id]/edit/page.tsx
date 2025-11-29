import { getImages } from "@/app/dashboard/images/action";
import ProjectForm from "@/components/form/project-form";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProjectById } from "@/server/actions/project";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) redirect("/dashboard/project");
  const images = await getImages();

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 py-5 px-7 mx-auto">
      {/* Header with navigation and title */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="hover:bg-muted/50"
        >
          <Link href="/dashboard/project">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Edit Project</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Update your project: {project.title as string}
            </p>
          </div>
        </div>
      </div>

      {/* Form container with improved spacing */}
      <div className="space-y-6">
        <ProjectForm
          images={images}
          initialData={project}
          redirectUrl="/dashboard/project"
        />
      </div>
    </section>
  );
}
