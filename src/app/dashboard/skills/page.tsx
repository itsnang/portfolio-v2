import { SkillsTable } from "@/features/skills/components/skills-table";
import { getSkills } from "@/features/skills/actions";

async function SkillPage() {
  const skills = await getSkills();

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <SkillsTable items={skills} />
    </section>
  );
}

export default SkillPage;
