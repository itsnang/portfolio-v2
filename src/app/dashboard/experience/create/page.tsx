import { ExperienceForm } from "@/components/form/experienc-form";
import React from "react";
import { getImages } from "../../images/action";
import { getCurrentUser } from "@/lib/lucia/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

async function CreateExperiencePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  const images = await getImages();

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/experience">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Add New Experience</h1>
      </div>

      <div className="border-t pt-8">
        <ExperienceForm images={images} redirectUrl="/dashboard/experience" />
      </div>
    </section>
  );
}

export default CreateExperiencePage;
