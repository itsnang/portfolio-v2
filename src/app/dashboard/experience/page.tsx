import { ExperienceTable } from "@/components/experience-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getImages } from "../images/action";
import { getExperiences } from "./action";

async function ExperiencePage() {
  const [, experiences] = await Promise.all([getImages(), getExperiences()]);

  return (
    <section className="antialiased max-w-5xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Experience</h1>
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <Link href="/dashboard/experience/create">
            <PlusIcon className="h-4 w-4" />
            Add Experience
          </Link>
        </Button>
      </div>

      <ExperienceTable experiences={experiences} />
    </section>
  );
}

export default ExperiencePage;
