import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppConfig } from "@/features/app-config/actions";
import { getBlogDetail } from "@/features/blog/actions";
import { stripHtml } from "@/components/wireframe/wireframe-utils";
import { BlogDetail } from "./blog-detail";
import { WireframeBlogDetail } from "./wireframe-blog-detail";

export const revalidate = 3600;

const SITE_URL = "https://lornsamnang.com";
const AUTHOR = "Lorn Samnang";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogDetail(slug);
    const url = `${SITE_URL}/blog/${slug}`;
    const published = post.publishedAt?.toISOString();
    const modified = (post.updatedAt ?? post.publishedAt)?.toISOString();

    return {
      title: post.title,
      description: post.excerpt,
      keywords: [post.category, "blog", AUTHOR, "software development"],
      authors: [{ name: AUTHOR, url: SITE_URL }],
      alternates: { canonical: url },
      openGraph: {
        type: "article",
        url,
        title: post.title,
        description: post.excerpt,
        siteName: `${AUTHOR}'s Portfolio`,
        locale: "en_US",
        publishedTime: published,
        modifiedTime: modified,
        authors: [AUTHOR],
        section: post.category,
        tags: [post.category],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        creator: "@lornsamnang",
      },
    };
  } catch {
    return { title: "Blog post" };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const [post, config] = await Promise.all([
    getBlogDetail(slug).catch(() => null),
    getAppConfig(),
  ]);

  if (!post) notFound();

  const url = `${SITE_URL}/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    image: post.coverImage
      ? [post.coverImage]
      : [`${url}/opengraph-image`],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: (post.updatedAt ?? post.publishedAt)?.toISOString(),
    wordCount: stripHtml(post.content).split(/\s+/).filter(Boolean).length,
    author: { "@type": "Person", name: AUTHOR, url: SITE_URL },
    publisher: { "@type": "Person", name: AUTHOR, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {config.theme === "wireframe" ? (
        <WireframeBlogDetail post={post} />
      ) : (
        <BlogDetail post={post} />
      )}
    </>
  );
}
