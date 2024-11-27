export interface IProfile {
  id: string;
  name: string;
  imageUrl: string;
  socials: Abouts;
  skills: Abouts;
  description: string;
  abouts: Abouts;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface Abouts {
  ["en-US"]: string;
  ["km-KH"]: string;
  ["zh-CN"]: string;
}
