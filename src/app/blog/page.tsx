import type { Metadata } from "next";
import { getAppConfig } from "@/features/app-config/actions";
import { getPublishedBlogPosts } from "@/features/blog/actions";
import { BlogList } from "@/features/blog/components/blog-list";
import { WireframeBlogList } from "@/components/wireframe/wireframe-blog-list";

export const revalidate = 3600;

const DESCRIPTION =
  "Write-ups on things I build, break, and learn — mostly software, sometimes not.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: { canonical: "https://lornsamnang.com/blog" },
  openGraph: {
    type: "website",
    url: "https://lornsamnang.com/blog",
    title: "Blog | Lorn Samnang",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Lorn Samnang",
    description: DESCRIPTION,
  },
};

export default async function BlogIndexPage() {
  const [posts, config] = await Promise.all([
    getPublishedBlogPosts(),
    getAppConfig(),
  ]);

  if (config.theme === "wireframe") {
    return <WireframeBlogList posts={posts} />;
  }

  return <BlogList posts={posts} />;
}
