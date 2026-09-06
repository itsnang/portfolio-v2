import { getProjectDetail } from "@/features/project/actions";
import { stripHtml } from "@/components/wireframe/wireframe-utils";
import { renderWireframeOgImage } from "@/lib/og";

// Inline literals: Next statically analyses these to build the route.
export const alt = "Project — Lorn Samnang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectDetail(projectId).catch(() => null);

  return renderWireframeOgImage({
    eyebrow: "// project",
    title: project?.title ?? "Projects",
    description: project ? stripHtml(project.description) : "Stuff I actually built.",
    tag: project?.technologies?.[0]?.name ?? null,
  });
}
