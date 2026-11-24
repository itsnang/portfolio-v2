import "server-only";

import { cache } from "react";
import { neighbours } from "@portfolio/db/queries";

import { db } from "@/db/drizzle";
import { NotFoundError } from "@/lib/errors";

/**
 * Public detail-page read: the project plus its prev/next neighbours. Cached per
 * request, since metadata, the page and the OG image all ask for it.
 */
export const getProjectDetail = cache(async (projectId: string) => {
  const project = await db.query.TbProject.findFirst({
    where: (p, { eq, and, isNull }) => and(eq(p.id, projectId), isNull(p.deletedAt)),
  });
  if (!project) throw new NotFoundError();

  const allProjects = await db.query.TbProject.findMany({
    where: (p, { eq, and, isNull }) => and(eq(p.isActive, true), isNull(p.deletedAt)),
    columns: { id: true, title: true },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  return { ...project, ...neighbours(allProjects, (p) => p.id === projectId) };
});
