import React from "react";
import { ResumeCard } from "./resume-card";
import { IEducation } from "@/types/profile.type";
import { convertDate } from "@/helper/convert-date";

interface EducationProps {
  education: IEducation[];
}

export const Education: React.FC<EducationProps> = ({ education }) => {
  return (
    <section className="flex min-h-0 flex-col gap-y-3">
      <h2 className="text-xl font-bold">Education</h2>
      {education.map((education) => (
        <ResumeCard
          key={education.school}
          href={education.href ?? "/"}
          logoUrl={education.logoUrl}
          altText={education.school}
          title={education.school}
          subtitle={education.degree}
          period={`${convertDate(education.startDate)} - ${
            convertDate(education.endDate) ?? "Present"
          }`}
        />
      ))}
    </section>
  );
};
