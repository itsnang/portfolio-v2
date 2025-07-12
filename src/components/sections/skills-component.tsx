import { ISkill } from "@/types/profile.type";
import Image from "next/image";
import React from "react";

interface SkillProps {
  skills: ISkill[];
}

export const Skills: React.FC<SkillProps> = ({ skills }) => {
  return (
    <section className="py-6">
      <h2 className="text-xl font-bold">Skills</h2>
      <div className="flex pt-4 flex-wrap gap-3">
        {skills.map((skill, idex) => (
          <div
            key={idex}
            className="disabled:opacity-75 shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center gap-1"
          >
            <Image src={skill.logoUrl} alt="Next.js" width={20} height={20} />
            <span className="font-medium text-sm">{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
