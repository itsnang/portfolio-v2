import type { IProfile } from "@portfolio/db/schema";

export type { IProfile };

export type EditableProfile = Pick<
  IProfile,
  "name" | "imageUrl" | "bio" | "abouts" | "aboutImages" | "isAvailable"
>;
