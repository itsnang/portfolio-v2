import Image from "next/image";
import React from "react";

const SKILLS = [
  {
    title: "Next.js",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
    url: "https://nextjs.org/",
  },
  {
    title: "React",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
    url: "https://reactjs.org/",
  },
  {
    title: "TypeScript",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
    url: "https://www.typescriptlang.org/",
  },
  {
    title: "TypeScript",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
    url: "https://www.typescriptlang.org/",
  },
  {
    title: "TypeScript",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
    url: "https://www.typescriptlang.org/",
  },
  {
    title: "TypeScript",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
    url: "https://www.typescriptlang.org/",
  },
  {
    title: "TypeScript",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
    url: "https://www.typescriptlang.org/",
  },
];

export const Skills = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {SKILLS.map((skill, idex) => (
        <div
          key={idex}
          className="disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center gap-1"
        >
          <Image src={skill.icon} alt="Next.js" width={20} height={20} />
          <span className="font-medium text-sm">{skill.title}</span>
        </div>
      ))}
    </div>
  );
};
