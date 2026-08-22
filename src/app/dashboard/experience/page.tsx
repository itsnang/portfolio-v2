import { ExperienceTable } from "@/features/experience/components/experience-table";
import { getImages } from "../images/action";
import { getExperiences } from "@/features/experience/actions";

async function ExperiencePage() {
  const [images, experiences] = await Promise.all([getImages(), getExperiences()]);

  return (
    <section className="antialiased max-w-5xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <ExperienceTable experiences={experiences} images={images} />
    </section>
  );
}

export default ExperiencePage;
