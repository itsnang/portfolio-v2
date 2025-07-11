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
  thumbnail: string;
  description: string;
  links: ProjectLinks[] | null;
  technologies: ProjectTechnology[] | null;
  detailImage: string[] | null;
}

export interface ISocial {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface IRecommendation {
  id: string;
  name: string;
  position: string;
  profileImageUrl: string;
  recommendationText: string;
}

export interface IImages {
  id: string;
  imageUrl: string;
}

export type ProjectLinks = { type: string; href: string };
export type ProjectTechnology = { name: string; logoUrl: string };
