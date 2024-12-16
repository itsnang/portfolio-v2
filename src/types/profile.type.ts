export interface IProfile {
  id: string;
  name: string;
  boi: string;
  imageUrl: string;
  abouts: string;
  aboutImages: string[];
  skills: ISkill[];
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
}

export interface ISkill {
  id: string;
  name: string;
  logoUrl: string;
}

export interface IExperience {
  id: string;
  title: string;
  imageUrl: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
}

export interface IEducation {
  id: string;
  school: string;
  degree: string;
  logoUrl: string;
  href: string | null;
  startDate: Date;
  endDate: Date | null;
}

export interface IProject {
  id: string;
  title: string;
  href: string | null;
  image: string;
  description: string;
  technologies: string[];
  links: ProjectLinks[] | null;
}

export interface ISocial {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface IImages {
  id: string;
  imageUrl: string;
}

export type ProjectLinks = { type: string; href: string };
