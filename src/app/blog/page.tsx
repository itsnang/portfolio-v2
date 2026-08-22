import { getAppConfig } from "@/features/app-config/actions";
import { getPublishedBlogPosts } from "@/features/blog/actions";
import { BlogList } from "@/features/blog/components/blog-list";
import { WireframeBlogList } from "@/components/wireframe-blog-list";

export const revalidate = 3600;

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
