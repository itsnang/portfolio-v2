import React from "react";
import { ResumeCard } from "./resume-card";

const EDUCATION = [
  {
    school: "Royal University of Phnom Penh",
    href: "https://www.rupp.edu.kh/",
    degree: "Bachelor's Degree of Computer Science",
    logoUrl: "https://rupp.edu.kh/images/rupp-logo.png",
    start: "2023",
    end: "Current",
  },
  {
    school: "Sabaicode",
    href: "https://sabaicode.com",
    degree: "Full Stack Web Development",
    logoUrl: "https://sabaicode.com/sabaicode.jpg",
    start: "2016",
    end: "2021",
  },
];

export const Education = () => {
  return (
    <div className="flex min-h-0 flex-col gap-y-3">
      <h2 className="text-xl font-bold">Education</h2>
      {EDUCATION.map((education) => (
        <ResumeCard
          key={education.school}
          href={education.href}
          logoUrl={education.logoUrl}
          altText={education.school}
          title={education.school}
          subtitle={education.degree}
          period={`${education.start} - ${education.end}`}
        />
      ))}
    </div>
  );
};
