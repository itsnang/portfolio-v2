"use server";

import { db } from "@/db/drizzle";
import { projecInsertSchema, ProjectInsert } from "@/db/schema/project.schema";
import { TbProject } from "@/db/table";
import { withAuthAction } from "@/lib/auth/middleware";
import { NotFoundError } from "@/lib/errors";
import { err, ok } from "@justmiracle/result";
import { asc, desc, eq } from "drizzle-orm";

export const createProjectAction = withAuthAction(
  async (auth, project: ProjectInsert) => {
    try {
      const validated = projecInsertSchema.safeParse(project);
      if (!validated.success) {
        throw new Error("Invalid project data");
      }

      if (!auth.profile) {
        throw new Error("Profile not found. Please create a profile first.");
      }

      const projectData = await db
        .insert(TbProject)
        .values({ ...project, profileId: auth.profile.id })
        .returning();

      return {
        success: true,
        data: projectData,
        message: "Project created successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Failed to create project" };
    }
  }
);

export const updateProjectAction = withAuthAction(
  async (_, id: string, project: ProjectInsert) => {
    try {
      const validated = projecInsertSchema.safeParse(project);
      if (!validated.success) {
        throw new Error("Invalid project data");
      }

      const existingProject = await db.query.TbProject.findFirst({
        where: (projectRow, { eq }) => eq(projectRow.id, id),
      });

      if (!existingProject) {
        throw new Error("Project not found");
      }

      const updatedProject = await db
        .update(TbProject)
        .set(project)
        .where(eq(TbProject.id, id))
        .returning();

      return {
        success: true,
        data: updatedProject,
        message: "Project updated successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Failed to update project" };
    }
  }
);

export const getProjects = async () => {
  try {
    const projects = await db.query.TbProject.findMany({
      orderBy: (project, { asc, desc }) => [
        asc(project.sortOrder),
        desc(project.createdAt),
      ],
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
};

export const reorderProjectsAction = withAuthAction(
  async (_, items: { id: string; sortOrder: number }[]) => {
    try {
      await Promise.all(
        items.map(({ id, sortOrder }) =>
          db.update(TbProject).set({ sortOrder }).where(eq(TbProject.id, id))
        )
      );
      return { success: true, message: "Projects reordered" };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Failed to reorder projects" };
    }
  }
);

export const getProjectById = async (id: string) => {
  try {
    const project = await db.query.TbProject.findFirst({
      where: (project, { eq }) => eq(project.id, id),
    });
    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error("Failed to fetch project");
  }
};

/** Public detail-page read: the project plus its prev/next neighbors for in-order navigation. */
export const getProjectDetail = async (projectId: string) => {
  const project = await db.query.TbProject.findFirst({
    where: (p, { eq, and, isNull }) =>
      and(eq(p.id, projectId), isNull(p.deletedAt)),
  })
    .then((p) => {
      if (!p) throw new NotFoundError();
      return p;
    })
    .then(ok)
    .catch(err);

  if (project.error) throw new NotFoundError();

  const allProjects = await db.query.TbProject.findMany({
    where: (p, { eq, and, isNull }) =>
      and(eq(p.isActive, true), isNull(p.deletedAt)),
    columns: { id: true, title: true },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  const idx = allProjects.findIndex((p) => p.id === projectId);
  const total = allProjects.length;
  const prev = allProjects[(idx - 1 + total) % total];
  const next = allProjects[(idx + 1) % total];

  return {
    ...project.value,
    number: idx + 1,
    total,
    prev,
    next,
  };
};
