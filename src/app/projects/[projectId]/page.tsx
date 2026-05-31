import { getAppConfig } from "@/app/action";
import { getProjectDetail } from "./action";
import { ProjectDetail } from "./project-detail";
import { WireframeProjectDetail } from "./wireframe-project-detail";

export const revalidate = 3600;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, config] = await Promise.all([
    getProjectDetail(projectId),
    getAppConfig(),
  ]);

  if (config.theme === "wireframe") {
    return <WireframeProjectDetail project={project} />;
  }

  return <ProjectDetail project={project} />;
}
