import { ExperienceForm } from "@/components/form/experienc-form";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { getImages } from "../../images/action";

async function CreateExperiencePage() {
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
          <Link href="/dashboard/experience">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <PlusIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Add New Experience</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new work experience entry for your portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Form container with improved spacing */}
      <div className="space-y-6">
        <ExperienceForm images={images} redirectUrl="/dashboard/experience" />
      </div>
    </section>
  );
}

export default CreateExperiencePage;
