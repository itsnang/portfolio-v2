export interface IProfile {
  id: number;
  name: string;
  boi: string;
  imageUrl: string;
  abouts: string;
  aboutImages: string[];
  skills: ISkill[];
  experience: IExperience[];
  education: IEducation[];
}

export interface ISkill {
  id: number;
  name: string;
  logoUrl: string;
}

export interface IExperience {
  id: number;
  title: string;
  imageUrl: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
}

export interface IEducation {
  id: number;
  school: string;
  degree: string;
  logoUrl: string;
  href: string | null;
  startDate: Date;
  endDate: Date | null;
}

export interface IProject {
  id: number;
  title: string;
  href: string | null;
  image: string;
  description: string;
  technologies: string[];
  links: ProjectLinks[] | null;
}

export type ProjectLinks = { type: string; href: string };
