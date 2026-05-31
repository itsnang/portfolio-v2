import { db } from "@/db/drizzle";
import { NotFoundError } from "@/lib/errors";
import { err, ok } from "@justmiracle/result";

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
