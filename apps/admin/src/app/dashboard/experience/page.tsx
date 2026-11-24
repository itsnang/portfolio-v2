import { ExperienceTable } from "@/features/experience/components/experience-table";
import { getExperiences } from "@/features/experience/admin-queries";

async function ExperiencePage() {
  const experiences = await getExperiences();

  return <ExperienceTable experiences={experiences} />;
}

export default ExperiencePage;
