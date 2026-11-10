import type { ProjectLinks, ProjectTechnology } from "@/db/table";

export type { ProjectLinks, ProjectTechnology };

export interface IProject {
  id: string;
  title: string;
  href: string | null;
  thumbnail: string;
  description: string;
  links: ProjectLinks[] | null;
  technologies: ProjectTechnology[] | null;
  detailImage: string[] | null;
}
