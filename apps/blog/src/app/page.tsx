import type { Metadata } from "next";
import { WireframeBlogList } from "@portfolio/wireframe/wireframe-blog-list";
import { BlogList } from "@/components/blog-list";
import { getAppConfig, getPublishedBlogPosts } from "@/lib/queries";
import { AUTHOR, BLOG_DESCRIPTION, SITE_NAME, blogPageUrl } from "@/lib/metadata";
import { mainUrl } from "@/lib/site-urls";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: `Blog | ${AUTHOR}` },
  description: BLOG_DESCRIPTION,
  alternates: { canonical: blogPageUrl("/") },
  // Page-level openGraph and twitter replace the layout's, so repeat the shared fields.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: blogPageUrl("/"),
    title: `Blog | ${AUTHOR}`,
    description: BLOG_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@lornsamnang",
    title: `Blog | ${AUTHOR}`,
    description: BLOG_DESCRIPTION,
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
