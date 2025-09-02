import { ISkill } from "@/types/profile.type";
import Image from "next/image";
import React from "react";

interface SkillProps {
  skills: ISkill[];
}

export const Skills: React.FC<SkillProps> = ({ skills }) => {
  return (
    <section className="py-6" aria-labelledby="skills-heading">
      <h2 id="skills-heading" className="text-2xl font-bold">Skills</h2>
      <div 
        className="flex pt-4 flex-wrap gap-3"
        role="list"
        aria-label="List of technical skills"
      >
        {skills.map((skill, index) => (
          <div
            key={skill.name || index}
            role="listitem"
            className="disabled:opacity-75 shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-xs ring-1 ring-inset ring-border bg-background hover:bg-accent disabled:bg-background focus-ring-inset inline-flex items-center gap-1"
            aria-label={`${skill.name} skill`}
          >
            <Image 
              src={skill.logoUrl} 
              alt={`${skill.name} logo`}
              width={20} 
              height={20} 
              loading="lazy"
              sizes="20px"
            />
            <span className="font-medium text-sm">{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
