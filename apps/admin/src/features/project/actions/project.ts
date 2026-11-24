"use server";

import { and, eq, isNull } from "drizzle-orm";
import { projecInsertSchema, type ProjectInsert, TbProject } from "@portfolio/db/schema";

import { db } from "@/db/drizzle";
import { ActionError, adminAction, parseInput } from "@/lib/admin-action";

const dashboardPath = "/dashboard/project";

const ownProject = (id: string, profileId: string) =>
  and(eq(TbProject.id, id), eq(TbProject.profileId, profileId), isNull(TbProject.deletedAt));

/** The parsed project without a client-controlled owner: a project's owner never changes. */
function parseProject(project: ProjectInsert) {
  const { profileId: _owner, ...values } = parseInput(projecInsertSchema, project, "Invalid project data");
  return values;
}

export const createProjectAction = adminAction(
  "Failed to create project",
  async ({ profile }, project: ProjectInsert) => {
    const [created] = await db
      .insert(TbProject)
      .values({ ...parseProject(project), profileId: profile.id })
      .returning();
    return {
      data: created,
      message: "Project created successfully",
      dashboardPath,
      refresh: { resource: "project", slugs: [created.id] },
    };
  }
);

export const updateProjectAction = adminAction(
  "Failed to update project",
  async ({ profile }, id: string, project: ProjectInsert) => {
    const [updated] = await db
      .update(TbProject)
      .set(parseProject(project))
      .where(ownProject(id, profile.id))
      .returning();
    if (!updated) throw new ActionError("Project not found");
    return {
      data: updated,
      message: "Project updated successfully",
      dashboardPath,
      refresh: { resource: "project", slugs: [id] },
    };
  }
);

export const deleteProjectAction = adminAction(
  "Failed to delete project",
  async ({ profile }, id: string) => {
    const [deleted] = await db
      .update(TbProject)
      .set({ deletedAt: new Date() })
      .where(ownProject(id, profile.id))
      .returning({ id: TbProject.id });
    if (!deleted) throw new ActionError("Project not found");
    return {
      data: undefined,
      message: "Project deleted",
      dashboardPath,
      // Refreshing the Project's page turns it into a 404.
      refresh: { resource: "project", slugs: [id] },
    };
  }
);

export const reorderProjectsAction = adminAction(
  "Failed to reorder projects",
  async ({ profile }, items: { id: string; sortOrder: number }[]) => {
    await Promise.all(
      items.map(({ id, sortOrder }) =>
        db.update(TbProject).set({ sortOrder }).where(ownProject(id, profile.id))
      )
    );
    return { data: undefined, message: "Projects reordered", dashboardPath, refresh: { resource: "project" } };
  }
);
