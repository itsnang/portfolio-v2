import { SkillsTable } from "@/features/skills/components/skills-table";
import { getSkills } from "@/features/skills/admin-queries";

async function SkillPage() {
  const skills = await getSkills();

  return <SkillsTable items={skills} />;
}

export default SkillPage;
