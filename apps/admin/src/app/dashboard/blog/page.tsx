import { BlogTable } from "@/features/blog/components/blog-table";
import { getBlogPosts } from "@/features/blog/admin-queries";
import { env } from "@/utils/env";

async function BlogPage() {
  const posts = await getBlogPosts();

  return <BlogTable posts={posts} blogUrl={env.BLOG_SITE_URL} />;
}

export default BlogPage;
