import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppConfig } from "@/features/app-config/actions";
import { getProjectDetail } from "@/features/project/actions";
import { stripHtml } from "@/components/wireframe/wireframe-utils";
import { ProjectDetail } from "./project-detail";
import { WireframeProjectDetail } from "./wireframe-project-detail";

export const revalidate = 3600;

const SITE_URL = "https://lornsamnang.com";
const AUTHOR = "Lorn Samnang";

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { projectId } = await params;
  try {
    const project = await getProjectDetail(projectId);
    const description = stripHtml(project.description).slice(0, 200);
    const url = `${SITE_URL}/projects/${projectId}`;

    return {
      title: project.title,
      description,
      keywords: [
        project.title,
        ...(project.technologies?.map((t) => t.name) ?? []),
        "project",
        AUTHOR,
      ],
      authors: [{ name: AUTHOR, url: SITE_URL }],
      alternates: { canonical: url },
      openGraph: {
        type: "website",
        url,
        title: project.title,
        description,
        siteName: `${AUTHOR}'s Portfolio`,
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description,
        creator: "@lornsamnang",
      },
    };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { projectId } = await params;
  const [project, config] = await Promise.all([
    getProjectDetail(projectId).catch(() => null),
    getAppConfig(),
  ]);

  if (!project) notFound();

  const url = `${SITE_URL}/projects/${projectId}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: stripHtml(project.description).slice(0, 500),
    image: project.thumbnail ? [project.thumbnail] : [`${url}/opengraph-image`],
    keywords: project.technologies?.map((t) => t.name).join(", "),
    author: { "@type": "Person", name: AUTHOR, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(project.href ? { sameAs: [project.href] } : {}),
    url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {config.theme === "wireframe" ? (
        <WireframeProjectDetail project={project} />
      ) : (
        <ProjectDetail project={project} />
      )}
    </>
  );
}
