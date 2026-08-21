import { BlogTable } from "@/components/blog-table";
import { getBlogPosts } from "@/server/actions/blog";
import { getImages } from "../images/action";

async function BlogPage() {
  const [images, posts] = await Promise.all([getImages(), getBlogPosts()]);

  return (
    <section className="antialiased max-w-5xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <BlogTable posts={posts} images={images} />
    </section>
  );
}

export default BlogPage;
