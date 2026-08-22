import { BlogTable } from "@/features/blog/components/blog-table";
import { getBlogPosts } from "@/features/blog/actions";

async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="antialiased max-w-5xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <BlogTable posts={posts} />
    </section>
  );
}

export default BlogPage;
