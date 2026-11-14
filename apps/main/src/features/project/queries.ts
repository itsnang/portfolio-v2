import "server-only";

import { err, ok } from "@justmiracle/result";

import { db } from "@/db/drizzle";
import { NotFoundError } from "@/lib/errors";

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
  // Linear (non-circular) pagination — wrapping around with modulo made prev
  // and next collide on the same project whenever there were exactly 2.
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx >= 0 && idx < total - 1 ? allProjects[idx + 1] : null;

  return {
    ...project.value,
    number: idx + 1,
    total,
    prev,
    next,
  };
};
