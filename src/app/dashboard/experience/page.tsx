import { ExperienceTable } from "@/features/experience/components/experience-table";
import { getExperiences } from "@/features/experience/actions";

async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <section className="antialiased max-w-5xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <ExperienceTable experiences={experiences} />
    </section>
  );
}

export default ExperiencePage;
