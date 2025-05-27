import React from "react";
import { ExperienceCard } from "./experience-card";
import { IExperience } from "@/types/profile.type";
import { convertDate } from "@/helper/convert-date";

interface ExperienceProps {
  experience: IExperience[];
}

export const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  return (
    <section className="flex min-h-0 flex-col gap-y-3 py-6">
      <h2 className="text-xl font-bold">Work Experience</h2>
      {experience.map((work) => (
        <ExperienceCard
          key={work.id}
          logoUrl={work.imageUrl}
          altText={work.company}
          title={work.company}
          subtitle={work.title}
          // href={work.href}
          // badges={work.badges}
          period={`${convertDate(work.startDate)} - ${
            convertDate(work.endDate) ?? "Present"
          }`}
          description={work.description ?? ""}
        />
      ))}
    </section>
  );
};
