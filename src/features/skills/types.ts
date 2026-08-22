import type { SkillCategory } from "@/db/table";

export interface ISkill {
  id: string;
  name: string;
  logoUrl: string;
  category: SkillCategory;
}
