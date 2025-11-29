"use server";

import { db } from "@/db/drizzle";
import { projecInsertSchema, ProjectInsert } from "@/db/schema/project.schema";
import { TbProject } from "@/db/table";
import { withAuthAction } from "./middleware";
import { eq } from "drizzle-orm";

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
      orderBy: (project, { desc }) => [desc(project.createdAt)],
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
};

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
