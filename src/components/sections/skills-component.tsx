import { skillCategoryEnum } from "@/db/table";
import { ISkill } from "@/types/profile.type";
import Image from "next/image";
import React from "react";

interface SkillProps {
  skills: ISkill[];
}

export const Skills: React.FC<SkillProps> = ({ skills }) => {
  const grouped = skillCategoryEnum.enumValues.reduce<Record<string, ISkill[]>>(
    (acc, cat) => {
      acc[cat] = skills.filter((s) => s.category === cat);
      return acc;
    },
    {},
  );

  return (
    <section className="py-6" aria-labelledby="skills-heading">
      <h2 id="skills-heading" className="text-2xl font-bold mb-6">
        Skills
      </h2>
      <div className="space-y-6">
        {skillCategoryEnum.enumValues.map((cat) => {
          const group = grouped[cat];
          if (!group || group.length === 0) return null;
          return (
            <div key={cat}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {cat}
              </p>
              <div
                className="flex flex-wrap gap-3"
                role="list"
                aria-label={`${cat} skills`}
              >
                {group.map((skill) => (
                  <div
                    key={skill.id}
                    role="listitem"
                    className="shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-xs ring-1 ring-inset ring-border bg-background hover:bg-accent inline-flex items-center gap-1"
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
            </div>
          );
        })}
      </div>
    </section>
  );
};
