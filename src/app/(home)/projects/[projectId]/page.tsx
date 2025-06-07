import React from "react";
import { getProjectDetail } from "./action";
import { ProjectDetail } from "./project-detail";

async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;
  const projectDetail = await getProjectDetail(projectId);

  return <ProjectDetail projectDetail={projectDetail} />;
}

export default ProjectDetailPage;
