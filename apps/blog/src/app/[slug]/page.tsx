import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stripHtml } from "@portfolio/wireframe/wireframe-utils";
import { getAppConfig, getBlogDetail } from "@/lib/queries";
import { AUTHOR, SITE_NAME, authorUrl, postUrl } from "@/lib/metadata";
import { mainUrl } from "@/lib/site-urls";
import { BlogDetail } from "./blog-detail";
import { WireframeBlogDetail } from "./wireframe-blog-detail";

export const revalidate = 3600;

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogDetail(slug).catch(() => null);
  if (!post) return { title: "Blog post" };

  const url = postUrl(slug);
  const published = post.publishedAt?.toISOString();
  const modified = (post.updatedAt ?? post.publishedAt)?.toISOString();

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, "blog", AUTHOR, "software development"],
    authors: [{ name: AUTHOR, url: authorUrl }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      siteName: SITE_NAME,
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
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const [post, config] = await Promise.all([
    getBlogDetail(slug).catch(() => null),
    getAppConfig(),
  ]);

  if (!post) notFound();

  const url = postUrl(slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    image: post.coverImage ? [post.coverImage] : [`${url}/opengraph-image`],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: (post.updatedAt ?? post.publishedAt)?.toISOString(),
    wordCount: stripHtml(post.content).split(/\s+/).filter(Boolean).length,
    // The author is the person, whose home is the Main Site.
    author: { "@type": "Person", name: AUTHOR, url: authorUrl },
    publisher: { "@type": "Person", name: AUTHOR, url: authorUrl },
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
        <WireframeBlogDetail post={post} homeUrl={mainUrl} />
      ) : (
        <BlogDetail post={post} homeUrl={mainUrl} />
      )}
    </>
  );
}
