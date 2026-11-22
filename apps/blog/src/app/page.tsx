import type { Metadata } from "next";
import { WireframeBlogList } from "@portfolio/wireframe/wireframe-blog-list";
import { BlogList } from "@/components/blog-list";
import { getAppConfig, getPublishedBlogPosts } from "@/lib/queries";
import { mainUrl } from "@/lib/site-urls";

export const revalidate = 3600;

const DESCRIPTION =
  "Write-ups on things I build, break, and learn — mostly software, sometimes not.";

export const metadata: Metadata = {
  title: { absolute: "Blog | Lorn Samnang" },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
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
  const [posts, config] = await Promise.all([getPublishedBlogPosts(), getAppConfig()]);

  if (config.theme === "wireframe") {
    // Posts live at the root of this Site, so the base address is empty.
    return <WireframeBlogList posts={posts} postBaseUrl="" homeUrl={mainUrl} />;
  }

  return <BlogList posts={posts} homeUrl={mainUrl} />;
}
