import { db, takeFirstOrThrow } from "@/db/drizzle";
import { NotFoundError } from "@/lib/errors";
import { err, ok } from "@justmiracle/result";

export const getProjectDetail = async (projectId: string) => {
  const project = await db.query.TbProject.findMany({
    where: (project, { eq }) => eq(project.id, projectId),
    columns: {
      thumbnail: true,
      title: true,
      description: true,
      technologies: true,
      detailImage: true,
    },
  })
    .then(takeFirstOrThrow)
    .then(ok)
    .catch(err);
  if (project.error) {
    console.log("======>", project.error.message);
    throw new NotFoundError();
  }
  return project.value;
};
