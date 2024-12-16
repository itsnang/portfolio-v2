import React from "react";
import { ProjectCard } from "./project-card";
import { IProject } from "@/types/profile.type";

interface ProjectsProps {
  projects: IProject[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <section className="pt-4">
      <h2 className="text-xl font-bold">Projects</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
        {projects.map((project) => (
          <ProjectCard
            href={project.href ?? `projects/${project.id}`}
            key={project.title}
            title={project.title}
            description={project.description}
            tags={project.technologies ?? []}
            image={project.thumbnail}
            links={project.links ?? []}
          />
        ))}
      </div>
    </section>
  );
};
