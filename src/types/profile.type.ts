import type { ISocial } from "@/features/socials/types";
import type { ISkill } from "@/features/skills/types";
import type { IEducation } from "@/features/education/types";
import type { IExperience } from "@/features/experience/types";
import type { IRecommendation } from "@/features/recommendations/types";
import type { IProject } from "@/features/project/types";

export interface IProfile {
  id: string;
  name: string;
  isAvailable: boolean;
  bio: string | null;
  imageUrl: string;
  abouts: string;
  aboutImages: string[] | null;
  skills: ISkill[];
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
  recommendations: IRecommendation[];
  socials: ISocial[];
}
