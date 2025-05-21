"use client";

import { ExperienceForm } from "./experienc-form";
import { Experiences } from "@/db/schema/experiences.schema";
import { IImages } from "@/types/profile.type";

interface ExperienceFormWrapperProps {
  images: IImages[];
  initialData?: Experiences;
  redirectUrl: string;
}

export const ExperienceFormWrapper: React.FC<ExperienceFormWrapperProps> = (
  props
) => {
  return <ExperienceForm {...props} />;
};
