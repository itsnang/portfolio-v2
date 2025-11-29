"use client";

import { Project } from "@/db/schema/project.schema";
import { ProjectTechnology } from "@/types/profile.type";
import { Button } from "./ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_TECHNOLOGIES = 2;
const EMPTY_STATE_MESSAGE =
  "No projects added yet. Add your first project below.";

interface TechnologiesListProps {
  technologies: ProjectTechnology[] | null | undefined;
  maxVisible?: number;
  className?: string;
}

const TechnologiesList = ({
  technologies,
  maxVisible = MAX_VISIBLE_TECHNOLOGIES,
  className,
}: TechnologiesListProps) => {
  if (!technologies || technologies.length === 0) {
    return null;
  }

  const visibleTechnologies = technologies.slice(0, maxVisible);
  const remainingCount = technologies.length - maxVisible;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {visibleTechnologies.map((tech, idx) => (
        <span
          key={`${tech.name}-${idx}`}
          className="text-xs px-1.5 py-0.5 bg-muted rounded-md truncate max-w-[50px]"
          title={tech.name}
        >
          {tech.name}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="text-xs px-1.5 py-0.5 bg-muted rounded-md">
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

interface ProjectThumbnailProps {
  src: string;
  alt: string;
  size?: "sm" | "md";
}

const ProjectThumbnail = ({ src, alt, size = "sm" }: ProjectThumbnailProps) => {
  const sizeClasses = {
    sm: "size-12",
    md: "size-16",
  };

  return (
    <div
      className={cn(
        "relative rounded-md overflow-hidden border bg-muted flex-shrink-0",
        sizeClasses[size]
      )}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
};

interface ProjectRowProps {
  project: Project;
}

const ProjectTableRow = ({ project }: ProjectRowProps) => {
  const thumbnail = String(project.thumbnail || "");
  const title = String(project.title || "");
  const description = String(project.description || "");
  const technologies = project.technologies as ProjectTechnology[] | null;
  const editUrl = `/dashboard/project/${project.id}/edit`;

  return (
    <TableRow>
      <TableCell className="w-[70px]">
        <ProjectThumbnail src={thumbnail} alt={title} />
      </TableCell>
      <TableCell className="w-[180px] font-medium">{title}</TableCell>
      <TableCell className="max-w-[100px]">
        <p className="line-clamp-1 text-sm text-muted-foreground truncate">
          {description}
        </p>
      </TableCell>
      <TableCell className="w-[120px]">
        <TechnologiesList technologies={technologies} maxVisible={2} />
      </TableCell>
      <TableCell className="w-[90px]">
        <Badge variant={project.isActive ? "default" : "secondary"}>
          {project.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="w-[70px]">
        <Link href={editUrl} aria-label={`Edit ${title}`}>
          <Button variant="ghost" size="icon">
            <PencilIcon className="h-4 w-4" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const thumbnail = String(project.thumbnail || "");
  const title = String(project.title || "");
  const description = String(project.description || "");
  const technologies = project.technologies as ProjectTechnology[] | null;
  const editUrl = `/dashboard/project/${project.id}/edit`;

  return (
    <div className="rounded-lg border p-4 space-y-4 bg-card">
      <div className="flex items-start justify-between gap-4">
        <ProjectThumbnail src={thumbnail} alt={title} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {description}
          </p>
        </div>
        <Link href={editUrl} aria-label={`Edit ${title}`}>
          <Button variant="ghost" size="icon">
            <PencilIcon className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Technologies</span>
          <TechnologiesList
            technologies={technologies}
            className="justify-end"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Status</span>
          <Badge
            variant={project.isActive ? "default" : "secondary"}
            className="ml-auto"
          >
            {project.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export const ProjectTable = ({ projects }: { projects: Project[] }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {EMPTY_STATE_MESSAGE}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px]">Thumbnail</TableHead>
              <TableHead className="w-[180px]">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px]">Technologies</TableHead>
              <TableHead className="w-[90px]">Status</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <ProjectTableRow key={project.id} project={project} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
